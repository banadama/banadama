import Link from 'next/link';
import { requireRole } from '@/lib/auth';

export const metadata = {
  title: 'Projects | Banadama Creator',
};

export default async function ProjectsPage() {
  const user = await requireRole(['CREATOR']);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage your creative projects and collaborations
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
          New Project
        </button>
      </div>

      {/* Project Status Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        {['All', 'Active', 'Completed', 'On Hold'].map((status) => (
          <button
            key={status}
            className="px-4 py-3 border-b-2 border-transparent hover:border-gray-300 font-medium text-sm text-gray-600 transition-colors"
          >
            {status}
          </button>
        ))}
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((project) => (
          <div key={project} className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-gray-900">Project {project}</h3>
                <p className="text-sm text-gray-600 mt-1">Project description goes here</p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                Active
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium text-gray-900">0%</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-0 bg-blue-600" />
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
