import { MovieModal } from "./components/MovieModal";
import { Movies } from "./components/Movies";
import logo from './tmdb_blue.svg';

function App() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-600 min-h-screen flex flex-col">
      <header className="flex flex-col justify-center items-center context-center h-32 my-5">
        <h1 className="font-heading text-center text-7xl text-gray-300">NowPlaying</h1>
      </header>
      <Movies />
      <MovieModal />
      <footer className="flex flex-col justify-center items-center my-5 p-5">
        <a className="inline-block w-80" href="https://www.themoviedb.org/" rel="noreferrer">
          <img src={logo} className="block w-full" alt="Powered by TMDB" />
        </a>
      </footer>
    </div>
  );
}

export default App;
