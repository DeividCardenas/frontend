export type SubModule = {
  key: string;
  path: string;
  title: string;
};

export type Module = {
  key: string;
  path: string;
  title: string;
  sub: string;
  icon: string;
  subModules?: SubModule[];
};
