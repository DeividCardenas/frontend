export type StatCardData = {
  title: string;
  value: string;
  change: string;
  changeType: "increase" | "decrease";
  icon: React.ReactNode;
};

export type PendingTask = {
  id: string;
  label: string;
  category: string;
  dueDate: string;
};

export type Banner = {
  title: string;
  text: string;
};
