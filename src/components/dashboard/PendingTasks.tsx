import { PendingTask } from "../../types/dashboard";

// Datos de ejemplo, normalmente vendrían de una API
const tasks: PendingTask[] = [
  {
    id: "1",
    label: "Revisar informe de emisiones",
    category: "Auditoría",
    dueDate: "15 Sep",
  },
  {
    id: "2",
    label: "Actualizar matriz de riesgos",
    category: "Mejora",
    dueDate: "20 Sep",
  },
  {
    id: "3",
    label: "Firmar acta de reunión",
    category: "Documental",
    dueDate: "22 Sep",
  },
];

export const PendingTasks = () => {
  return (
    <div className="bg-white rounded-xl shadow-md h-full flex flex-col">
      <h3 className="p-5 font-bold text-gray-800 border-b">
        Tareas Pendientes ({tasks.length})
      </h3>
      <div className="flex-grow p-3 space-y-2 overflow-y-auto">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <p className="font-semibold text-sm text-gray-800">{task.label}</p>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                {task.category}
              </span>
              <span className="text-xs text-gray-500">
                Vence: {task.dueDate}
              </span>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="text-center text-sm text-gray-500 p-4">
            ¡No tienes tareas pendientes!
          </p>
        )}
      </div>
    </div>
  );
};
