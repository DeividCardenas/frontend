export const calculateDeadlineInfo = (deadline: string) => {
  const deadlineDate = new Date(deadline);
  const today = new Date();

  // Reset time part to compare dates only
  deadlineDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = deadlineDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isOverdue = diffDays < 0;
  let displayText = "";

  if (isOverdue) {
    displayText = `Retrasado por ${Math.abs(diffDays)} día(s)`;
  } else if (diffDays === 0) {
    displayText = "Vence hoy";
  } else {
    displayText = `Vence en ${diffDays} día(s)`;
  }

  const formattedDate = deadline.substring(0, 10);

  return {
    isOverdue,
    displayText,
    formattedDate,
  };
};
