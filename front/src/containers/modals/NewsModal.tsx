import React from "react";
import { useQuery } from "react-query";
import { HttpClient } from "../../api/HttpClient";
import { VERSION } from "../../constants/global";
import CustomModal from "./CustomModal";
import happyLogo from "../../assets/img/logo_happy.png";

const NewsModal = () => {
  const [showNewsModal, setShowNewsModal] = React.useState(process.env.NODE_ENV === "development");
  const newsDivRef = React.useRef<any>(null);
  const newsQuery = useQuery(
    "news-query",
    async () => {
      const { query, abort } = HttpClient.GET("/news.html", {
        cache: "no-cache",
      });
      let promise = query.then((res: any) => res.text());

      promise.cancel = abort;
      return promise;
    },
    { refetchOnWindowFocus: false, enabled: showNewsModal }
  );

  React.useEffect(() => {
    if (newsQuery.data && newsDivRef.current) {
      newsDivRef.current.innerHTML = newsQuery.data;
    }
  }, [newsQuery.data, newsDivRef.current, showNewsModal]);

  React.useEffect(() => {
    const version = window.localStorage.getItem("version");
    if (!version || version !== VERSION) {
      setShowNewsModal(true);
    }
  }, []);

  const toggleClose = (e: any) => {
    setShowNewsModal(false);
    window.localStorage.setItem("version", VERSION);
  };
  return (
    <CustomModal contentClassName="w-3/4 lg:w-1/2" isOpen={showNewsModal} onRequestClose={toggleClose}>
      <div style={{ zIndex: 0 }} className="w-full">
        <h1 className="text-2xl font-bold text-center pb-2 border-b-2 border-black relative">
          {VERSION} : What's new ? 🚀
          <img src={happyLogo} className="absolute object-contain h-24" style={{ top: -25, right: 10, zIndex: -1 }} alt="happy_logo" />
        </h1>
        {newsQuery.isLoading && <div>Chargement en cours...</div>}
        <div id="news" ref={newsDivRef} className="pt-10 bg-white" style={{ zIndex: 2 }}></div>
        <div className="text-center mt-10 text-sm font-bold">Made with ❤ by Dorian Maliszewski</div>
      </div>
    </CustomModal>
  );
};

export default NewsModal;
