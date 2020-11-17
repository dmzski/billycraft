import React from "react";

const SupportPage = () => {
  return (
    <div>
      <div className="flex flex-col bg-white rounded-md shadow-lg p-5 text-lg">
        <h2 className="font-bold text-2xl leading-tight mb-4">Un problème ? contactez nous !</h2>
        <a className="ml-4 flex items-center text-blue-700 mb-2" href="mailto:maliszewskid3@gmail.com">
          <span className="material-icons mr-3">email</span> <span> maliszewskid3@gmail.com</span>
        </a>
        <a className=" ml-4 flex items-center text-blue-700" href="tel:0619755845">
          <span className="material-icons mr-3">call</span> <span> 06 19 75 58 45</span>
        </a>
      </div>
    </div>
  );
};

export default SupportPage;
