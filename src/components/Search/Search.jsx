import styles from "./Search.module.css";

const Search = ({
  id,
  className = "",
  testId,
  placeholder = "Type to search...",
  onSearch,
  value,
}) => {
  return (
    <input
      id={id}
      className={`${styles.search} ${className}`}
      data-testid={testId}
      type="search"
      aria-describedby="search"
      tabIndex={0}
      placeholder={`🔍 ${placeholder}`}
      onChange={onSearch}
      value={value}
    />
  );
};

export default Search;
