const ItemDetail = ({ item }) => {
  return (
    <div>
      <h2>{item.title}</h2>
      <ul>
        {Object.entries(item).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {value.toString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ItemDetail;
