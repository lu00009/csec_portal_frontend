import { FaExternalLinkAlt } from "react-icons/fa";

const Resources = () => {
  const resources = [
    {
      name: "Data science & AI challenges",
      link: "https://googlecodejam.com/challenges"
    },
    {
      name: "Math-based programming problems",
      link: "https://googlecodejam.com/challenges"
    },
    {
      name: "Cybersecurity & hacking challenges",
      link: "https://googlecodejam.com/challenges"
    },
    {
      name: "Smart contract security challenges",
      link: "https://googlecodejam.com/challenges"
    },
    {
      name: "CP contests for beginners & intermediates",
      link: "https://googlecodejam.com/challenges"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6 w-160">
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
            {resources.map((resource, index) => (
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