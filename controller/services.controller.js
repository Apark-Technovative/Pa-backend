const Services = require("../model/services.model");
const fs = require("fs-extra");
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
    console.log(req.body);

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
  try {
    const { id } = req.params;
    console.log(id);

    const { title, description, tag, status } = req.body || {};
    console.log(req.body);

    const service = await Services.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    let images = [...service.image];

    let serviceImages = service.image;
    if (req.body?.removedImage) {
      let removeImage = req.body.removedImage;

      removeImage.forEach((element) => {
        serviceImages.forEach((items, index) => {
          if (element === items) {
            const imagePath = `./uploads/${element}`;
            console.log(imagePath);

            fs.remove(imagePath);
            images.splice(index, 1);
          }
        });
      });
    }

    if (req.files?.image) {
      req.files.image.forEach((file) => {
        images.push(file.filename);
      });
    }

    service.title = title ?? service.title;
    service.description = description ?? service.description;
    service.tag = tag ?? service.tag;
    service.status = status ?? service.status;
    service.image = images;

    const updatedService = await service.save();

    res.status(200).json({
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating service", error: error.message });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Services.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    // Remove associated images from the file system
    service.image.forEach((img) => {
      const imagePath = `./uploads/${img}`;
      fs.remove(imagePath);
    });

    await Services.findByIdAndDelete(id);
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting service", error: error.message });
  }
};
