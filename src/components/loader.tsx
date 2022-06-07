import { FC } from "react";

export const Spinner: FC = () => {
  return (

    <div className="d-flex justify-content-center align-items-center">
      <div className="container-spinner">
        <div className="spinner">
          <div className="spinner-item"></div>
          <div className="spinner-item"></div>
          <div className="spinner-item"></div>
          <div className="spinner-item"></div>
          <div className="spinner-item"></div>
        </div>
      </div>
    </div>
  );
};
