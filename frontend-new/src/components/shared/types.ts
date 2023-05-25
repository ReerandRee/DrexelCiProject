export enum SelectedPage {
  Home = "home",
  AboutUs = "aboutus",
  Help = "help",
  pages = "pages",
  jobcounts = "/jobcounts"
}

export interface AboutType {
  icon: JSX.Element;
  title: string;
  description: string;
}

export interface SectionType {
  name: string;
  description?: string;
  image: string;
}
