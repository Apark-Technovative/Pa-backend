const Services = require("../model/services.model");
const fs = require("fs-extra");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

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

exports.getService = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Services.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res
      .status(200)
      .json({ message: "Service fetched successfully", data: service });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching service", error: error.message });
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

    const { title, description, tag, status } = req.body || {};

    const service = await Services.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    let images = [...service.image];
    var toRemove = req.body?.removedImage;

    if (toRemove && !Array.isArray(toRemove)) {
      toRemove = ["None/none", toRemove];
    }

    if (toRemove && Array.isArray(toRemove)) {
      await Promise.all(
        toRemove.map(async (pid) => {
          cloudinary.uploader.destroy(pid);
        })
      );
      images = images.filter((img) => !toRemove.includes(img));
    }


    if(req.files && req.files.image){
      const updatedImages = req.files.image.map((file)=>file.filename)
      images = [...images,...updatedImages]
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
    // service.image.forEach((img) => {
    //   const imagePath = `./uploads/${img}`;
    //   fs.remove(imagePath);
    // });

    if (service.image && service.image.length > 0) {
      for (const image of service.image) {
        const pid = image.split(".")[0];
        const res = await cloudinary.uploader.destroy(pid);
      }
    }

    await Services.findByIdAndDelete(id);
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting service", error: error.message });
  }
};
