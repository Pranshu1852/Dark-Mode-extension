declare const culori: any;

console.log("content file is here");

function getColorArray(color: string) {
  const rgbaRegex = /rgba\((\d+),\s(\d+),\s(\d+),\s(\d+)\)$/;
  const rgbRegex = /rgb\((\d+),\s(\d+),\s(\d+)\)$/;
  let result: string[] | undefined;

  if (rgbaRegex.test(color)) {
    result = color.match(rgbaRegex)?.slice(1);
  } else if (rgbRegex.test(color)) {
    result = color.match(rgbRegex)?.slice(1);
  }

  console.log("Color result", result);

  return result;
}

function invertColor(colorArray: string[] | undefined) {
  if (!colorArray) {
    return;
  }

  for (let i = 0; i < 3; i++) {
    colorArray[i] = (255 - Number(colorArray[i])).toString();
  }

  return colorArray.length === 4
    ? `rgba(${colorArray.join(", ")})`
    : `rgb(${colorArray.join(",")})`;
}

function getShadowColor(shadow: string) {
  const getRgba = /rgba\(.*\)/;
  const newShadow = shadow.replace(getRgba, (match) => {
    console.log(match);
    console.log("parse", culori.parse(match));
    console.log("format", culori.formatRgb(culori.parse(match)));
    const parseColor = culori.formatRgb(culori.parse(match));

    console.log("parseColor", parseColor);

    console.log(
      "getColorArray",
      getColorArray(parseColor.slice(1, parseColor.length - 1))
    );
    console.log(
      "Inverted Color",
      getColorArray(culori.formatRgb(culori.parse(match) || ""))
    );

    return (
      invertColor(getColorArray(culori.formatRgb(culori.parse(match) || ""))) ||
      ""
    );
  });

  return newShadow;
}

let isDark = false;

chrome.runtime.onMessage.addListener((response, _, sendResponse) => {
  sendResponse({
    received: true,
  });

  isDark = response.isDark || false;

  changeColor(response.isDark);

  return true;
});

function changeColor(isDark: boolean) {
  const nodeList = document.querySelectorAll("*");
  nodeList.forEach((node) => {
    if (node instanceof HTMLElement) {
      if (isDark) {
        const computedStyle = getComputedStyle(node);
        console.log(node.tagName, computedStyle.boxShadow);

        node.style.boxShadow = getShadowColor(computedStyle.boxShadow);

        let currentNode = node;

        if (
          node.dataset.backgroundColor ||
          node.dataset.color ||
          node.dataset.borderColor
        ) {
          return;
        }

        while (
          currentNode &&
          (getComputedStyle(currentNode).backgroundColor ===
            "rgba(0, 0, 0, 0)" ||
            getComputedStyle(currentNode).backgroundColor ===
              "rgba(255, 255, 255, 0)")
        ) {
          if (!currentNode.parentElement) {
            break;
          }
          currentNode = currentNode.parentElement;
        }

        let newBgColor = invertColor(
          getColorArray(
            culori.formatRgb(culori.parse(computedStyle.backgroundColor)) || ""
          )
        );
        let newColor = invertColor(
          getColorArray(
            culori.formatRgb(culori.parse(computedStyle.color)) || ""
          )
        );
        let newBorderColor = invertColor(
          getColorArray(
            culori.formatRgb(culori.parse(computedStyle.borderColor)) || ""
          )
        );

        if (
          computedStyle.backgroundColor === "rgba(0, 0, 0, 0)" &&
          (getComputedStyle(currentNode).backgroundColor ===
            "rgba(0, 0, 0, 0)" ||
            getComputedStyle(currentNode).backgroundColor ===
              "rgba(255, 255, 255, 0)")
        ) {
          newBgColor = "rgba(0, 0, 0, 1)";
        }

        if (
          computedStyle.backgroundColor === "rgba(0, 0, 0, 0)" ||
          computedStyle.backgroundColor === "rgba(255, 255, 255, 0)" ||
          getComputedStyle(currentNode).backgroundColor ===
            "rgba(0, 0, 0, 0)" ||
          getComputedStyle(currentNode).backgroundColor ===
            "rgba(255, 255, 255, 0)"
        ) {
          newColor = "rgba(255, 255, 255, 1)";
        }

        if (newColor) {
          node.dataset.color = computedStyle.color;
          node.style.color = newColor;
        }

        if (newBgColor) {
          node.dataset.backgroundColor = computedStyle.backgroundColor;
          node.style.backgroundColor = newBgColor;
        }
        if (newBorderColor) {
          node.dataset.borderColor = computedStyle.borderColor;
          node.style.borderColor = newBorderColor;
        }
      } else {
        if (node.dataset.backgroundColor) {
          node.style.backgroundColor = node.dataset.backgroundColor;
          node.style.color = node.dataset.color || "";
          node.style.borderColor = node.dataset.borderColor || "";
        }
      }
    }
  });
}

const observer = new MutationObserver(() => {
  changeColor(isDark);
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
