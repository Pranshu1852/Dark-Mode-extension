import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./components/ui/command";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Minus } from "lucide-react";
import { useEffect, useState } from "react";

function App() {
  const [slider, setSlider] = useState(50);

  function getColorArray(color: string) {
    const rgbaRegex=/rgba\((\d+),\s(\d+),\s(\d+),\s(\d+)\)$/;
    const rgbRegex=/rgb\((\d+),\s(\d+),\s(\d+)\)$/;
    let result: string[] | undefined;

    if(rgbaRegex.test(color)) {
      result=color.match(rgbaRegex)?.slice(1);
    }
    else if(rgbRegex.test(color)) {
      result=color.match(rgbRegex)?.slice(1);
    }

    return result;
  }

  function invertColor(colorArray: string[] | undefined) {
    if(!colorArray){
      return;
    }

    for(let i=0;i<3;i++) {
      colorArray[i]=(255-Number(colorArray[i])).toString();
    }

    return colorArray.length === 4 ? `rgba(${colorArray.join(',')})` : `rgb(${colorArray.join(',')})`
  }

  useEffect(() => {
    const nodeList=document.querySelectorAll('*');
    nodeList.forEach((node) => {
      console.log(node.tagName , getColorArray(getComputedStyle(node).backgroundColor));
    });
  },[])

  return (
    <div className="w-full containerbox flex flex-col items-center gap-5 p-10">
      <Switch className="bg-blue-400" />
      <Tabs defaultValue="tab1">
        <TabsList className="w-96">
          <TabsTrigger className="cursor-pointer" value="tab1">
            Tab1
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="tab2">
            Tab2
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="tab3">
            Tab3
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1" className="flex flex-col gap-5 p-5">
          <div className="flex flex-row gap-4">
            <Button
              onClick={() => {
                setSlider((prevVal) => prevVal!==0 ? prevVal - 10: prevVal)
              }}
              variant="secondary"
              size="icon"
              className="size-8"
            >
              <Minus />
            </Button>
            <Slider
              defaultValue={[slider]}
              value={[slider]}
              max={100}
              step={1}
            />
            <Button
              onClick={() => setSlider((prevVal) => prevVal!==100 ? prevVal + 10: prevVal)}
              variant="secondary"
              size="icon"
              className="size-8"
            >
              <Plus />
            </Button>
          </div>
          <div className="flex flex-row gap-4">
            <Button
              onClick={() => {
                setSlider((prevVal) => prevVal!==0 ? prevVal - 10: prevVal)
              }}
              variant="secondary"
              size="icon"
              className="size-8"
            >
              <Minus />
            </Button>
            <Slider
              defaultValue={[slider]}
              value={[slider]}
              max={100}
              step={1}
            />
            <Button
              onClick={() => setSlider((prevVal) => prevVal!==100 ? prevVal + 10: prevVal)}
              variant="secondary"
              size="icon"
              className="size-8"
            >
              <Plus />
            </Button>
          </div>
          <div className="flex flex-row gap-4">
            <Button
              onClick={() => {
                setSlider((prevVal) => prevVal!==0 ? prevVal - 10: prevVal)
              }}
              variant="secondary"
              size="icon"
              className="size-8"
            >
              <Minus />
            </Button>
            <Slider
              defaultValue={[slider]}
              value={[slider]}
              max={100}
              step={1}
            />
            <Button
              onClick={() => setSlider((prevVal) => prevVal!==100 ? prevVal + 10: prevVal)}
              variant="secondary"
              size="icon"
              className="size-8"
            >
              <Plus />
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="tab2">
          <Command>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
              <CommandItem>Profile</CommandItem>
              <CommandItem>Billing</CommandItem>
              <CommandItem>Settings</CommandItem>
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
              <CommandItem>Profile</CommandItem>
              <CommandItem>Billing</CommandItem>
              <CommandItem>Settings</CommandItem>
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
              <CommandItem>Profile</CommandItem>
              <CommandItem>Billing</CommandItem>
              <CommandItem>Settings</CommandItem>
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
              <CommandItem>Profile</CommandItem>
              <CommandItem>Billing</CommandItem>
              <CommandItem>Settings</CommandItem>
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
              <CommandItem>Profile</CommandItem>
              <CommandItem>Billing</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandList>
          </Command>
        </TabsContent>
        <TabsContent value="tab3">Tab3</TabsContent>
      </Tabs>
      <div></div>
    </div>
  );
}

export default App;
