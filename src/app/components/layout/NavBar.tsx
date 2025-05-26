"use client";

import Link from 'next/link';

export default function NavBar () {

  const forceReload = (url) => {
    window.location.href = `${url}?t=${Date.now()}`;
  };

  return (
    <nav className="bg-sky-600 p-4">
      <ul className="flex space-x-4 text-white">
        <li>
          <Link href="/" className="hover:text-sky-900">
            Home
          </Link>
        </li>
        <li>
          <Link href="/users" className="hover:text-sky-900" style={{ marginLeft: '20px' }}>
            Users
          </Link>
        </li>
        <li>
          <Link href="/stl-visualizer" className="hover:text-sky-900" style={{ marginLeft: '20px' }}>
            STL Visualizer
          </Link>
        </li>
        <li>
        </li>
        <li>
          <Link href="/dicom-visualizer" className="hover:text-sky-900" style={{ marginLeft: '20px' }}>
            Dicom Visualizer
          </Link>
        </li>
        <li>
          <a
            href="#"
            className="hover:text-sky-900"
            style={{ marginLeft: '20px' }}
            onClick={(e) => {
              e.preventDefault();
              forceReload('/dicom-visualizer-mpr');
            }}
          >
            Dicom Visualizer (MPR)
          </a>
        </li>
        <li>
          <Link href="/contact" className="hover:text-sky-900" style={{ marginLeft: '20px' }}>
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
}
