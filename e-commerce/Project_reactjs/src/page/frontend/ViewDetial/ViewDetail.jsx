import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import require from "../../../utils/request";
import { useNavigate } from "react-router-dom";
import "./ViewDtial.css";
import  useStore from "../CustomHooks/HookS"
const ViewDetail = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const {cate, setCate} = useStore();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await require("/api/product", "GET");
        console.log(response);
        if (response && response.product) {
          setProducts(response.product);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProduct();
  }, []);

  const handleback = () => {
    navigate("/index/shop");
  }
  const headleBackByCate = (cate) => {

    setCate(cate);
    navigate("/index/shop");
  }
  const filter = products.find((p) => p.id == id);
  return (
    <>
      <div className="mt-5 container">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <div className="d-flex gap-2 header-list">
              <span onClick={handleback}><i class="bi bi-arrow-bar-left">Back to shop</i></span>
              <span>/</span>
              <span onClick={()  => headleBackByCate(filter?.category?.name)}>{filter?.category?.name}</span>
              <span>/</span>
              <span>{filter?.name}</span>
            </div>
            <div></div>
          </>
        )}
      </div>
    </>
  );
};

export default ViewDetail;
