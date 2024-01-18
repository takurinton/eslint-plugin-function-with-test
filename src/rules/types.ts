export type Errors = "test_required";

export type Messages = {
  [key in Errors]: string;
};
