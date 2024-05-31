import classNames from "./NoResults.module.css";
import { NO_MATCHING_RESULTS_MSG } from "../../constants";

const NoResults = () => {
  return (
    <section className={classNames.noResults}>
      {NO_MATCHING_RESULTS_MSG}
    </section>
  );
};

export default NoResults;
