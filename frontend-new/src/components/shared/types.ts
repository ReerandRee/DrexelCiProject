export enum SelectedPage {
  Home = "home",
  AboutUs = "aboutus",
  Help = "help",
  pages = "pages",
  analysis = "./analysis/index"
}

export interface AboutType {
  icon: JSX.Element;
  title: string;
  description: string;
}

export interface ClassType {
  name: string;
  description?: string;
  image: string;
}
