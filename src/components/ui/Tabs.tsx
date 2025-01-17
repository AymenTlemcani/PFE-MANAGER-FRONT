import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "../../lib/utils";

interface TabsProps extends RadixTabs.TabsProps {}
interface TabsListProps extends RadixTabs.TabsListProps {}
interface TabsTriggerProps extends RadixTabs.TabsTriggerProps {}
interface TabsContentProps extends RadixTabs.TabsContentProps {}

const Tabs = ({ className, ...props }: TabsProps) => (
  <RadixTabs.Root className={cn("w-full outline-none", className)} {...props} />
);

Tabs.List = ({ className, ...props }: TabsListProps) => (
  <RadixTabs.List
    className={cn(
      "flex h-12 items-center gap-4 border-b border-gray-200 dark:border-gray-700 outline-none",
      className
    )}
    {...props}
  />
);

Tabs.Trigger = ({ className, ...props }: TabsTriggerProps) => (
  <RadixTabs.Trigger
    className={cn(
      "flex items-center px-4 h-12 border-b-2 border-transparent",
      "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200",
      "data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400",
      // Remove all focus-related styles and outlines
      "outline-none focus:outline-none focus-visible:outline-none",
      "[&:focus]:outline-none [&:focus]:ring-0 [&:focus]:ring-offset-0 [&:focus]:shadow-none",
      "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none",
      // Add smooth transition
      "transition-colors duration-200 select-none",
      className
    )}
    {...props}
  />
);

Tabs.Content = ({ className, ...props }: TabsContentProps) => (
  <RadixTabs.Content
    className={cn(
      "outline-none focus:outline-none focus-visible:outline-none",
      "[&:focus]:outline-none [&:focus]:ring-0 [&:focus]:shadow-none",
      "focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none",
      className
    )}
    {...props}
  />
);

export { Tabs };
