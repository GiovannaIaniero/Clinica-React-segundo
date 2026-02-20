import Pagination from 'react-bootstrap/Pagination';

const Paginacion = ({ paginaActual, cantPaginas, onPageChange }) => {

  return (
    <Pagination className="d-flex justify-content-center">

      <Pagination.First
        onClick={() => onPageChange(1)}
        disabled={paginaActual === 1}
      />

      <Pagination.Prev
        onClick={() => onPageChange(paginaActual - 1)}
        disabled={paginaActual === 1}
      />

      {[...Array(cantPaginas)].map((_, index) => {
        const numero = index + 1;

        return (
          <Pagination.Item
            key={numero}
            active={numero === paginaActual}
            onClick={() => onPageChange(numero)}
          >
            {numero}
          </Pagination.Item>
        );
      })}

      <Pagination.Next
        onClick={() => onPageChange(paginaActual + 1)}
        disabled={paginaActual === cantPaginas}
      />

      <Pagination.Last
        onClick={() => onPageChange(cantPaginas)}
        disabled={paginaActual === cantPaginas}
      />

    </Pagination>
  );
};

export default Paginacion;
