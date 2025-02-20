const Modal = ({ children, title, onClose }) => {
  return (
    <div id="modal" className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-1/3">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button className="text-gray-500 hover:text-gray-700 float-right" onClick={onClose}>&times;</button>
        </div>
        <div className="p-4">
          {children}
        </div>
        <div className="p-4 border-t">
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
