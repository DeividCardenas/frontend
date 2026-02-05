import { ActionBox } from "./ActionBox";
import { ActivityLog } from "../../../types/mejora";

type ActivityFeedProps = {
  activities: ActivityLog[];
  onPublish: (comment: string, files: File[]) => void;
};

const ActivityIcon = ({ type }: { type: ActivityLog["type"] }) => {
  if (type === "status_change")
    return <span className="text-blue-500">🔄</span>;
  if (type === "file_upload") return <span className="text-green-500">📄</span>;
  return <span className="text-gray-500">💬</span>;
};

export const ActivityFeed = ({ activities, onPublish }: ActivityFeedProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-gray-800">
        Historial de Actividad
      </h3>

      <ActionBox onPublish={onPublish} />

      <div className="flow-root">
        <ul className="-mb-8">
          {activities.map((activity, index) => (
            <li key={activity.id}>
              <div className="relative pb-8">
                {index !== activities.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-start space-x-3">
                  <div className="relative">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                      <ActivityIcon type={activity.type} />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div>
                      <div className="text-sm">
                        <span className="font-semibold text-gray-900">
                          {activity.user}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-2 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      <p>{activity.content}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
