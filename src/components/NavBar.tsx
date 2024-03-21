import Link from "next/link";

function NavBar() {
  return (
    <div className="navbar shadow-md">
      <div className="md:px-6 w-full lg:w-3/4 mx-auto">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl">
            OMS
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/orders">Orders</Link>
            </li>
            <li>
              <Link href="/products">Products</Link>
            </li>
            {/* <li>
              <details>
                <summary>Parent</summary>
                <ul className="p-2 bg-base-100 rounded-t-none">
                  <li>
                    <a>Link 1</a>
                  </li>
                  <li>
                    <a>Link 2</a>
                  </li>
                </ul>
              </details>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
