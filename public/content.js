function getColorArray(color) {
  const rgbaRegex = /rgba\((\d+),\s(\d+),\s(\d+),\s(\d+)\)$/;
  const rgbRegex = /rgb\((\d+),\s(\d+),\s(\d+)\)$/;
  let result;

  if (rgbaRegex.test(color)) {
    result = color.match(rgbaRegex)?.slice(1);
  } else if (rgbRegex.test(color)) {
    result = color.match(rgbRegex)?.slice(1);
  }

  return result;
}

function invertColor(colorArray) {
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

const isDark=true;

const nodeList=document.querySelectorAll('*');
      nodeList.forEach((node) => {
        if(node instanceof HTMLElement) {
          if(isDark) {
            const computedStyle=getComputedStyle(node);
            console.log(node.tagName, {
              bgColor: computedStyle.backgroundColor,
              textColor: computedStyle.color,
              borderColor: computedStyle.borderColor,
            });
            
            let newBgColor=invertColor(getColorArray(computedStyle.backgroundColor) || '');
            let newColor=invertColor(getColorArray(computedStyle.color) || '');
            if(computedStyle.backgroundColor==="rgba(0, 0, 0, 0)") {
                newBgColor="rgba(0, 0, 0, 1)";
                newColor="rgba(255, 255, 255, 1)";
            }
                  
            const newBorderColor=invertColor(getColorArray(computedStyle.borderColor) || '');
            
            if(newColor) {
              node.dataset.color=computedStyle.color
              node.style.color=newColor;
            }
            if(newBgColor) {
              node.dataset.backgroundColor=computedStyle.backgroundColor
              node.style.backgroundColor=newBgColor;
            }
            if(newBorderColor) {
              node.dataset.borderColor=computedStyle.borderColor
              node.style.borderColor=newBorderColor;
            }

            console.log(node.tagName + "updated", {
              bgColor: node.style.backgroundColor,
              textColor: node.style.color,
              borderColor: node.style.borderColor,
            });
            
          }
          else {
            if(node.dataset.backgroundColor) {
              node.style.backgroundColor=node.dataset.backgroundColor;
              node.style.color=node.dataset.color;
              node.style.borderColor=node.dataset.borderColor;
            }
          }
        }
    });