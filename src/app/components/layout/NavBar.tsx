import Link from 'next/link';

export default function NavBar () {
  return (
    <nav className="bg-blue-600 p-4">
      <ul className="flex space-x-4 text-white">
        <li>
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
        </li>
        {/*<li>
          <Link href="/albums" className="hover:text-gray-300">
            Albums
          </Link>
        </li>*/}
        {/*<li>
          <Link href="/posts" className="hover:text-gray-300">
            Posts
          </Link>
        </li>*/}
        <li>
          <Link href="/users" className="hover:text-gray-300" style={{ marginLeft: '20px' }}>
            Users
          </Link>
        </li>
        <li>
          <Link href="/stl-viewer" className="hover:text-gray-300" style={{ marginLeft: '20px' }}>
            STL Viewer
          </Link>
        </li>
        <li>
          <Link href="/dicom-viewer" className="hover:text-gray-300" style={{ marginLeft: '20px' }}>
            Dicom Viewer (Pagination)
          </Link>
        </li>
        <li>
          <Link href="/dicom-viewer2" className="hover:text-gray-300" style={{ marginLeft: '20px' }}>
            Dicom Viewer (Series)
          </Link>
        </li>
        {/*<li>
          <Link href="/about" className="hover:text-gray-300" style={{ marginLeft: '20px' }}>
            About
          </Link>
        </li>*/}
        <li>
          <Link href="/contact" className="hover:text-gray-300" style={{ marginLeft: '20px' }}>
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
