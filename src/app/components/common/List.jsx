import Link from 'next/link'

const List = ({ items, model, disableDetails = false }) => {
  return (
    <div>
      {items?.map((item) => (
        <div key={item.id}>
          {disableDetails ? (
            <span>{item.title ?? item.name}</span>
          ) : (
            <Link href={`/${model}/${item.id}`}>{item.title ?? item.name}</Link>
          )}
        </div>
      ))}
    </div>
  );
}

export default List;
