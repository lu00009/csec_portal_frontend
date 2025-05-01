// components/profile/optionalinfo.tsx
import { FaExternalLinkAlt } from "react-icons/fa";

interface OptionalInfoProps {
  member: {
    uniId: string;
    linkedin: string;
    codeforces: string;
    leetcode: string;
    insta: string;
    birthdate: string;
    cv: string;
    joinedDate: string;
    shortbio: string;
  };
}

const OptionalInfo = ({ member }: OptionalInfoProps) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="bg-white w-160 rounded-lg shadow-sm p-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">      
      {/* Left Column */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">University ID</label>
          <p className="font-medium">{member.uniId}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">LinkedIn Account</label>
          <a 
            href={member.linkedin.startsWith('http') ? member.linkedin : '#'} 
            className="font-medium text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {member.linkedin}
          </a>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Codeforces Handle</label>
          <a 
            href={member.codeforces.startsWith('http') ? member.codeforces : '#'} 
            className="font-medium text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {member.codeforces}
            <FaExternalLinkAlt className="inline-block ml-1 text-gray-400" />
          </a>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Leetcode Handle</label>
          <a 
            href={member.leetcode.startsWith('http') ? member.leetcode : '#'} 
            className="font-medium text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {member.leetcode}
            <FaExternalLinkAlt className="inline-block ml-1 text-gray-400" />
          </a>
        </div>
      </div>
      
      {/* Right Column */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Instagram Handle</label>
          <p className="font-medium">{member.insta}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Birth Date</label>
          <p className="font-medium">{member.birthdate}</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">CV</label>
          <a 
            href={member.cv.startsWith('http') ? member.cv : '#'} 
            className="font-medium text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {member.cv}
            <FaExternalLinkAlt className="inline-block ml-1 text-gray-400" />
          </a>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">Joining Date</label>
          <p className="font-medium">{formatDate(member.joinedDate)}</p>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">Short Bio</label>
        <p className="font-medium">
          {member.shortbio}
        </p>
      </div>
    </div>
  );
};

export default OptionalInfo;