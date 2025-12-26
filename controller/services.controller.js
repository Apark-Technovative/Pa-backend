const Services = require("../model/services.model");

exports.getServices = async (req, res) => {
  try {
    const services = await Services.find();
    res
      .status(200)
      .json({ message: "Services fetched successfully", data: services });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching services", error: error.message });
  }
};

exports.createService = async (req, res) => {
  try {
    const { title, description, tag, status } = req.body;
    const image = req.files;
    console.log(image);

    // console.log(req.body);

    if (!title || !description || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (image.length <= 0) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    var images = [];

  
      req.files.image.forEach((img) => {
        console.log("Image File:", img.filename);
        images.push(img.filename);
      });
    

    console.log("Images Array:", images);
    const newService = await Services.create({
      title,
      description,
      tag,
      status,
      image: images,
    });

    res
      .status(201)
      .json({ message: "Service created successfully", data: newService });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating service", error: error.message });
  }
};


exports.updateService = async (req, res) => {
  // Handle updating a service logic here
  res.send(`Update Service with ID: ${req.params.id}`);
}