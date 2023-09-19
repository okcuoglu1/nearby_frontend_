import React, { useState } from "react";
import { Button, Form, Spinner, Table } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./home.scss";
import { getPlaces } from "../api/place-service";
import { SiGooglemaps } from "react-icons/si";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [places, setPlaces] = useState([]);

  const initialValues = { latitude: "", longitude: "", radius: "" };

  const validationSchema = Yup.object({
    latitude: Yup.number().required("Please enter the latitude!"),
    longitude: Yup.number().required("Please enter the longitude!"),
    radius: Yup.number().required("Please enter the radius!"),
  });

  const onSubmit = async (values) => {
    if (values.latitude > 90.0 || values.latitude < -90.0) {
      window.alert("Latitude value cannot be greater 90 or less than -90");
      return;
    }

    if (values.longitude > 180.0 || values.longitude < -180.0) {
      window.alert("Longitude value cannot be greater 180 or less than -180");
      return;
    }

    if (values.radius <= 0) {
      window.alert("Radius value cannot be less than or equals 0");
      return;
    }

    try {
      setLoading(true);
      const resp = await getPlaces(values);
      setPlaces(resp.data);
    } catch (error) {
      console.log(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  return (
    <div className="container home">
      <div className="queryForm">
        <div className="formTitle">WHAT is NEARBY?</div>
        <Form className="form" noValidate onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Latitude</Form.Label>
            <Form.Control
              type="number"
              {...formik.getFieldProps("latitude")}
              isValid={formik.touched.latitude && !formik.errors.latitude}
              isInvalid={formik.touched.latitude && !!formik.errors.latitude}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.latitude}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Longitude</Form.Label>
            <Form.Control
              type="number"
              {...formik.getFieldProps("longitude")}
              isValid={formik.touched.longitude && !formik.errors.longitude}
              isInvalid={formik.touched.longitude && !!formik.errors.longitude}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.longitude}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Radius</Form.Label>
            <Form.Control
              type="number"
              {...formik.getFieldProps("radius")}
              isValid={formik.touched.radius && !formik.errors.radius}
              isInvalid={formik.touched.radius && !!formik.errors.radius}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.radius}
            </Form.Control.Feedback>
          </Form.Group>
          <div>
            <Button
              variant="outline-primary"
              type="submit"
              disabled={!(formik.dirty && formik.isValid)}
            >
              {loading && <Spinner animation="border" size="sm" />} SEARCH
            </Button>
          </div>
        </Form>
      </div>
      <div className="result">
        <div colSpan={4}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Name</th>
                <th>Google Maps</th>
              </tr>
            </thead>
            <tbody>
              {places.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      textAlign: "center",
                      color: "white",
                      backgroundColor: "#fc8403",
                    }}
                  >
                    There is no location
                  </td>
                </tr>
              )}
              {places.map((item) => (
                <tr>
                  <td>{item.lat}</td>
                  <td>{item.lng}</td>
                  <td>{item.name}</td>
                  <td
                    style={{ textAlign: "center", color: "rgb(124, 20, 20)" }}
                  >
                    <a
                      target="_blank"
                      href={`https://www.google.com/maps?q=${item.lat},${item.lng}`}
                    >
                      <SiGooglemaps />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Home;
