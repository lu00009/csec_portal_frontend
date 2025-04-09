import { FaExternalLinkAlt } from "react-icons/fa";
import member1Data from "@/app/data/memberdata";
const Resources = () => {


  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Resources</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Resource Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Link
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {member1Data.resources.map((resource, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {resource.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                  <a 
                    href={resource.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {resource.link}
                  </a>
                  <FaExternalLinkAlt className="inline-block ml-1 text-gray-400" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Resources;