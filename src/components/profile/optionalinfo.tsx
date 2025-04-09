import member1Data from "@/app/data/memberdata";
const OptionalInfo = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">University ID</label>
            <p className="font-medium">{member1Data.optionalInfo.uniId}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">LinkedIn Account</label>
            <a 
              href="https://linkedin.com/henokassefa/profile" 
              className="font-medium text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
             {member1Data.optionalInfo.linkedin}
            </a>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Codeforces Handle</label>
            <a 
              href="https://codeforces/hena_bakos" 
              className="font-medium text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {member1Data.optionalInfo.codeforces}
            </a>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Leetcode Handle</label>
            <a 
              href="https://leetcode/Hena_bakos" 
              className="font-medium text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {member1Data.optionalInfo.leetcode}
            </a>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Instagram Handle</label>
            <p className="font-medium">{member1Data.optionalInfo.insta}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Birth Date</label>
            <p className="font-medium">{member1Data.optionalInfo.birthdate}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">CV</label>
            <a 
              href="https://github.com/Henabakos/Admin-edstelar" 
              className="font-medium text-blue-600 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {member1Data.optionalInfo.cv}
            </a>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Joining Date</label>
            <p className="font-medium">{member1Data.optionalInfo.joinedDate}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Short Bio</label>
            <p className="font-medium">
             {member1Data.optionalInfo.shortbio}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptionalInfo;