"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import TokenSwap from "./Swap";

export const NavBar = () => {
  const router = useRouter();

  return (
    <div className="navbar bg-base-100 shadow-lg z-50 fixed flex justify-center items-center">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <a>Homepage</a>
            </li>
            <li>
              <a>Portfolio</a>
            </li>
            <li>
              <a>About</a>
            </li>
          </ul>
        </div>
        <div className="flex-1">
          <a className="btn btn-ghost text-xs md:text-md lg:text-lg">
            Sovereign Capital
          </a>
        </div>
      </div>

      <div className="navbar-end">
        <ConnectButton
          showBalance={{
            smallScreen: false,
            largeScreen: true,
          }}
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
        />
        <dialog id="my_modal_3" className="modal">
          <div className="modal-box bg-base-200">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <TokenSwap />
          </div>
        </dialog>
        <button
          className="btn btn-primary btn-sm ml-2"
          onClick={() =>
            (document.getElementById("my_modal_3") as any).showModal()
          }
        >
          Swap
        </button>

        <div className="dropdown dropdown-end lg:flex hidden">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              Themes
              <span className="badge text-xs bg-blue-300">Try!</span>
            </div>
            <div
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-auto shadow"
            >
              <div className="form-control">
                <label className="label cursor-pointer gap-4">
                  <span className="label-text">Retro</span>
                  <input
                    type="radio"
                    name="theme-radios"
                    className="radio hidden theme-controller "
                    value="retro"
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer gap-4">
                  <span className="label-text">Cyberpunk</span>
                  <input
                    type="radio"
                    name="theme-radios"
                    className="radio hidden theme-controller "
                    value="cyberpunk"
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer gap-4">
                  <span className="label-text">Lofi</span>
                  <input
                    type="radio"
                    name="theme-radios"
                    className="radio hidden theme-controller "
                    value="lofi"
                  />
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer gap-4">
                  <span className="label-text">Cupcake</span>
                  <input
                    type="radio"
                    name="theme-radios"
                    className="radio hidden theme-controller "
                    value="cupcake"
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer gap-4">
                  <span className="label-text">Synthwave</span>
                  <input
                    type="radio"
                    name="theme-radios"
                    className="radio hidden theme-controller "
                    value="synthwave"
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer gap-4">
                  <span className="label-text">Garden</span>
                  <input
                    type="radio"
                    name="theme-radios"
                    className="radio hidden theme-controller "
                    value="garden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-circle avatar"
      >
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          />
        </div>
      </div>
    </div>
  );
};
