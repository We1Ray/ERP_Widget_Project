import React from "react";
import ContentWrapper from "../components/Layout/ContentWrapper";

Error.getInitialProps = async ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;
  return {
    statusCode,
  };
};

function Error({ statusCode }) {
  return (
    <ContentWrapper>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
    </ContentWrapper>
  );
}

export default Error;
