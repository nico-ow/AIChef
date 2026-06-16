export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Recipe: {
    recipe: any;
    mode?: "view" | "cook";
  };
  Main: undefined;
};