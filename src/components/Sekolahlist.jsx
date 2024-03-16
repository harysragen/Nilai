import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";

const SekolahList = () => {
  const [sekolahs, setSekolahs] = useState([]);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState(0);
  const [rows, setRows] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [query, setQuery] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getSekolahs();
  }, [page, keyword]);

  const getSekolahs = async () => {
    const response = await axios.get(
      `http://sragen.cloud:5000/sekolahs?search_query=${keyword}&page=${page}&limit=${limit}`
    );
    setSekolahs(response.data.result);
    setPage(response.data.page);
    setPages(response.data.totalPage);
    setRows(response.data.totalRows);
  };

  const changePage = ({ selected }) => {
    setPage(selected);
    if (selected === 9) {
      setMsg(
        "Jika tidak menemukan data yang Anda cari, silahkan cari data dengan kata kunci spesifik!"
      );
    } else {
      setMsg("");
    }
  };

  const searchData = (e) => {
    e.preventDefault();
    setPage(0);
    setMsg("");
    setKeyword(query);
  };

  
  return (
    <div className="container mt-5">
      <h1 className="title">Sekolah</h1>
      <h2 className="subtitle">List of Sekolah</h2>
      <Link to="/users/add" className="button is-primary mb-2">
        Add New
      </Link>
      <div className="columns">
        <div className="column is-centered">
          <form onKeyUp={searchData}>
            <div className="field has-addons">
              <div className="control is-expanded">
                <input
                  type="text"
                  className="input"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="ketikan nama sekolah atau NPSN..."
                />
              </div>
              <div className="control">
                <button type="submit" className="button is-info">
                  Search
                </button>
              </div>
            </div>
          </form>
          <table className="table is-striped is-bordered is-hoverable is-fullwidth mt-2">
        <thead>
          <tr>
            <th>No</th>
            <th>NPSN</th>
            <th>Nama</th>            
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sekolahs.map((sekolahs, index) => (
            <tr key={sekolahs.uuid}>
              <td>{index + 1}</td>
              <td>{sekolahs.npsn}</td>
              <td>{sekolahs.nama}</td>              
              <td>
                <Link
                  to={`/users/edit/${sekolahs.sekolah_id}`}
                  className="button is-small is-info"
                >
                  Edit
                </Link>
                <button
                  onClick={() => (sekolahs.sekolah_id)}
                  className="button is-small is-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
          <p>
            Total Baris: {rows} Hal: {rows ? page + 1 : 0} dari {pages}
          </p>
          <p className="has-text-centered has-text-danger">{msg}</p>
          <nav
            className="pagination is-centered"
            key={rows}
            role="navigation"
            aria-label="pagination"
          >
            <ReactPaginate
              previousLabel={"< Sebelumnya"}
              nextLabel={"Selanjutnya >"}
              pageCount={Math.min(10, pages)}
              onPageChange={changePage}
              containerClassName={"pagination-list"}
              pageLinkClassName={"pagination-link"}
              previousLinkClassName={"pagination-previous"}
              nextLinkClassName={"pagination-next"}
              activeLinkClassName={"pagination-link is-current"}
              disabledLinkClassName={"pagination-link is-disabled"}
            />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SekolahList;