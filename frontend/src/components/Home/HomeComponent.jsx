import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Nav from "../Home/Common/Nav";
import Pagination from "../../components/Common/Pagination";
import SearchBar from "../../components/Common/SearchBar";
import "../../css/Home/Home.css";
import img1 from "../../assets/img/invest.jpg";
import img2 from "../../assets/img/invest2.jpg";
import img3 from "../../assets/img/invest3.jpg";
import { Carousel } from "react-bootstrap";
import { getDataParams } from "../../services/apiServices";
import { FaProjectDiagram, FaBook, FaFilter } from "react-icons/fa";

const HomeComponent = () => {
  const [projects, setProjectData] = useState([]);
  const [publications, setPublicationData] = useState([]);
  const [projectStates, setProjectStates] = useState([]);
  const [publicationTypes, setPublicationTypes] = useState([]);
  const [selectedProjectState, setSelectedProjectState] = useState("");
  const [selectedPublicationTipo, setSelectedPublicationTipo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("Proyectos");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 6,
        ...(activeTab === "Proyectos"
          ? selectedProjectState && { estado: selectedProjectState }
          : selectedPublicationTipo && { tipoPublicacion: selectedPublicationTipo }),
        ...(searchTerm && { [activeTab === "Proyectos" ? "nombre" : "titulo"]: searchTerm }),
      };

      const endpoint = activeTab === "Proyectos" ? "projects" : "publications";
      const result = await getDataParams(endpoint, params);

      if (activeTab === "Proyectos") {
        const projects = result.projects || [];
        setProjectData(projects);
        setProjectStates([...new Set(projects.map(project => project.estado))]);
      } else {
        const pubs = result.publications || [];
        setPublicationData(pubs);
        setPublicationTypes([...new Set(pubs.map(pub => pub.tipoPublicacion))]);
      }

      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Error al traer los datos", error);
      activeTab === "Proyectos" ? setProjectData([]) : setPublicationData([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, searchTerm, selectedProjectState, selectedPublicationTipo]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const renderCards = () => {
    const items = activeTab === "Proyectos" ? projects : publications;
    return items.map((item) => (
      <div key={item._id} className="card">
        <div className="card-image">
          <img src={item.imagen || "https://via.placeholder.com/300x200"} alt={item.nombre || item.titulo} />
        </div>
        <div className="card-content">
          <h3>{item.nombre || item.titulo}</h3>
          <p>{(item.descripcion || item.resumen)?.substring(0, 100)}...</p>
          <p><strong>{activeTab === "Proyectos" ? "Estado:" : "Tipo:"}</strong> {item.estado || item.tipoPublicacion}</p>
          <Link to={`/${activeTab.toLowerCase()}/${item._id}`} className="card-button">
            Ver más
          </Link>
        </div>
      </div>
    ));
  };

  return (
    <div className="home-page">
      <Nav />

      <Carousel className="home-carousel">
        {[img1, img2, img3].map((img, index) => (
          <Carousel.Item key={index}>
            <img className="d-block w-100" src={img} alt={`Slide ${index + 1}`} />
            <Carousel.Caption>
              <h3>Investigación e Innovación</h3>
              <p>Descubre nuestros proyectos y publicaciones más recientes</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>

      <div className="home-container">
        <SearchBar
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder={`Buscar ${activeTab.toLowerCase()}...`}
        />

        <div className="home-tabs">
          <button
            className={`home-tab ${activeTab === "Proyectos" ? "active" : ""}`}
            onClick={() => { setActiveTab("Proyectos"); setCurrentPage(1); }}
          >
            <FaProjectDiagram /> Proyectos
          </button>
          <button
            className={`home-tab ${activeTab === "Publicaciones" ? "active" : ""}`}
            onClick={() => { setActiveTab("Publicaciones"); setCurrentPage(1); }}
          >
            <FaBook /> Publicaciones
          </button>
        </div>

        <div className="filters-container">
          <FaFilter className="filter-icon" />
          <select
            value={activeTab === "Proyectos" ? selectedProjectState : selectedPublicationTipo}
            onChange={(e) => {
              activeTab === "Proyectos"
                ? setSelectedProjectState(e.target.value)
                : setSelectedPublicationTipo(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Todos</option>
            {(activeTab === "Proyectos" ? projectStates : publicationTypes).map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="loading-spinner"></div>
        ) : (
          <div className="cards-container">
            {renderCards()}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onNext={handleNextPage}
          onPrev={handlePrevPage}
          disabledPrev={currentPage === 1}
          disabledNext={currentPage === totalPages}
        />
      </div>
    </div>
  );
};

export default HomeComponent;