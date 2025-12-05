import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Hero1Props {
  heading: string;
  description: string;
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };

}

const Hero1 = ({
  heading = "YouPick",
  description = "Finely crafted components built with React, Tailwind and Shadcn UI. Developers can copy and paste these blocks directly into their project.",
  buttons = {
    primary: {
      text: "Discover all components",
      url: "https://www.shadcnblocks.com",
    },
    secondary: {
      text: "View on GitHub",
      url: "https://www.shadcnblocks.com",
    },
  },
 
}: Hero1Props) => {
  return (
    <section className="py-12 lg:py-32">
      {/* <div className="container  min-w-350"> */}
      <div className="container px-4 md:px-6">
        {/* <div className="grid items-center gap-5 lg:grid-cols-2"> */}
          <div className="flex flex-col items-center text-center lg:items-center">
           
            <h1 className="my-6 text-pretty text-3xl font-bold sm:text-4xl lg:text-6xl">
              {heading}
            </h1>

             {/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg
                className=" left-0 w-full h-3 text-accent"
                viewBox="0 0 300 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 6 C 30 0, 60 12, 90 6 S 150 12, 180 6 S 240 0, 300 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
            </svg>
           
            <p className="text-muted-foreground mb-8 max-w-xl lg:text-xl">
              {description}
            </p>
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-center lg:items-center">
              {buttons.primary && (
                <Button asChild className="w-full sm:w-auto glow-effect ">
                  <a href={buttons.primary.url}>{buttons.primary.text}</a>
                </Button>
              )}
              {buttons.secondary && (
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href={buttons.secondary.url}>
                    {buttons.secondary.text}
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        {/* </div> */}
      </div>
    </section>
  );
};

export { Hero1 };
