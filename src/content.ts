declare const culori: any;

console.log("content file is here");

function checkIsDark(colorArray: string[] | undefined) {
  if (!colorArray) {
    return true;
  }

  const luminance =
    (0.299 * Number(colorArray[0]) +
      0.587 * Number(colorArray[1]) +
      0.114 * Number(colorArray[2])) /
    255;

  if (luminance <= 0.4) {
    return true;
  }

  return false;
}

function getColorArray(color: string) {
  const rgbaRegex =
    /rgba\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)$/;
  const rgbRegex =
    /rgb\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*\)$/;
  let result: string[] | undefined;

  if (rgbaRegex.test(color)) {
    result = color.match(rgbaRegex)?.slice(1);
  } else if (rgbRegex.test(color)) {
    result = color.match(rgbRegex)?.slice(1);
  }

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
        if (node.tagName === "PRE") {
          return;
        }

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

        let newBgColor = computedStyle.backgroundColor;
        let newColor = computedStyle.color;
        let newBorderColor = computedStyle.borderColor;

        console.log(node.tagName, {
          OrginalbgColor: newBgColor,
          bgColor: getColorArray(culori.formatRgb(culori.parse(newBgColor))),
          OriginalColor: newColor,
          Color: getColorArray(culori.formatRgb(culori.parse(newColor))),
          OriginalborderColor: newBorderColor,
          borderColor: getColorArray(
            culori.formatRgb(culori.parse(newBorderColor))
          ),
        });

        if (!checkIsDark(getColorArray(newBgColor))) {
          newBgColor =
            invertColor(
              getColorArray(
                culori.formatRgb(culori.parse(computedStyle.backgroundColor)) ||
                  "rgba(0, 0, 0, 0)"
              )
            ) || "rgba(0, 0, 0, 0)";
        }
        if (checkIsDark(getColorArray(newColor))) {
          newColor =
            invertColor(
              getColorArray(
                culori.formatRgb(culori.parse(computedStyle.color)) ||
                  "rgba(0, 0, 0, 0)"
              )
            ) || "rgba(0, 0, 0, 0)";
        }
        if (checkIsDark(getColorArray(newBorderColor))) {
          newBorderColor =
            invertColor(
              getColorArray(
                culori.formatRgb(culori.parse(computedStyle.borderColor)) ||
                  "rgba(0, 0, 0, 0)"
              )
            ) || "rgba(0, 0, 0, 0)";
        }

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
          if (!checkIsDark(getColorArray(computedStyle.borderBottomColor))) {
            newColor = computedStyle.color;
          }
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
