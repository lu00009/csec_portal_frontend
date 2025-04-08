'use client';

import { FiPlus } from 'react-icons/fi';
import eventman from '../../assets/eventman.svg'
import Image from 'next/image';

const UpcomingEvent = () => {
    return (
      <div className=" w-[580px] px-6 mt-6 not-last:h-[250px] ">
        <div className="max-w-4xl mx-auto">
          <div className="bg-blue-400 h-[260px]  rounded-lg shadow-sm p-6 border border-gray-100">
            {/* First row - Event title and Members tag */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Upcoming Event</h2>
                <p className="text-gray-900 mt-1">Cross-division knowledge-sharing</p>
              </div>
              <div className="flex items-center bg-red-500 w-[92px] h-[25px] rounded-lg justify-center">
                <h4 className="text-white text-sm">Members</h4>
              </div>
            </div>
  
            {/* Image */}
            <div className="my-4 mx-auto w-[150px] h-[100px] bg-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">
                <Image src={eventman} alt="man" />
              </span>
            </div>{/* Add to calendar button */}
          <div className="flex justify-end">
            <div className="bg-blue-800 rounded-lg p-2 text-white hover:bg-blue-700 transition duration-200">
              <button className="flex items-center">
                <FiPlus className="mr-1" />
                <span>Add to calendar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UpcomingEvent;