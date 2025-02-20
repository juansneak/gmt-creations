export default function Footer () {
  return (
    <footer className="bg-gray-800 text-white py-4 fixed bottom-0 left-0 w-full">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} GMT Creations. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="/" className="hover:text-gray-400">About</a>
          <a href="/contact" className="hover:text-gray-400">Contact</a>
        </div>
      </div>
    </footer>
  );
}
