import React from "react";
import { useQuery } from "react-query";
import { HttpClient } from "../api/HttpClient";
import { VERSION } from "../constants/global";
import Layout from "../containers/layout/Layout";

import happyLogo from "../assets/img/logo_happy.png";

const Dashboard = () => {
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
    { refetchOnWindowFocus: false }
  );

  React.useEffect(() => {
    if (newsQuery.data) {
      document.getElementById("news")!.innerHTML = newsQuery.data;
    }
  }, [newsQuery.data]);

  return (
    <Layout>
      <div className="flex justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg w-1/2 p-5" style={{ zIndex: 0 }}>
          <h1 className="text-2xl font-bold text-center pb-2 border-b-2 border-black relative">
            {VERSION} : What's new ? 🚀
            <img src={happyLogo} className="absolute object-contain h-24" style={{ top: -25, right: 10, zIndex: -1 }} alt="happy_logo" />
          </h1>
          {newsQuery.isLoading && <div>Chargement en cours...</div>}
          <div id="news" className="pt-10 bg-white" style={{ zIndex: 2 }}></div>
          <div className="text-center mt-10 text-sm font-bold">Made with ❤ by Dorian Maliszewski</div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
