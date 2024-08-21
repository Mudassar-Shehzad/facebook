import React from 'react';

function HomeRight() {
    return (
        <div className="w-[20%] h-[89.5vh] py-3 p-10 hidden laptop:flex laptop:flex-col">
            <div className="mb-6">
                <h3 className="text-gray-600 font-semibold mb-2">Sponsored</h3>
                <div className="flex items-start mb-4">
                    <img
                        src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600"
                        alt="Ad 1"
                        className="w-16 h-16 rounded-lg mr-4"
                    />
                    <div>
                        <p className="font-medium text-sm text-gray-800">Lucky97</p>
                        <a href="#" className="text-sm text-gray-500">lucky117.com</a>
                    </div>
                </div>
                <div className="flex items-start">
                    <img
                        src="https://via.placeholder.com/100"
                        alt="Ad 2"
                        className="w-16 h-16 rounded-lg mr-4"
                    />
                    <div>
                        <p className="font-medium text-sm text-gray-800">Gold Skill, Games Club 2024</p>
                        <a href="#" className="text-sm text-gray-500">g-tp.blogspot.com</a>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h3 className=" font-semibold mb-2">Contacts</h3>
                <div className="flex items-center mb-4 hover:bg-gray-100 cursor-pointer rounded-lg bg-opacity-100 px-2 py-2">
                    <img
                        src='https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=600'
                        alt="User"
                        className="w-8 h-8 rounded-full mr-2"
                    />
                    <p className="font-medium text-sm">Sahil Mehboob</p>
                </div>
            </div>

            <div>
                <h3 className=" font-semibold mb-2">Group conversations</h3>
                <div className="flex items-center cursor-pointer content-center py-2 px-1 hover:bg-gray-200 my-2 rounded-lg">
                    {/* <span className="text-xl mr-4">+</span> */}
                    <p className="font-medium text-[1rem]">+ Create New Group</p>
                </div>
            </div>
        </div>
    );
}

export default HomeRight;
