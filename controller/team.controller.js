const Team = require("../model/team.model");
const fs = require("fs-extra");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");
const ApiFeatures = require("../utils/apiFeatures");

exports.addTeam = async (req, res) => {
  try {
    const { name, position, description, status } = req.body;
    const image = req.files;
    console.log(image);

    
    if ((!name, !position, !description)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    var images = [];
    if (image.length > 0) {
      if (image.length <= 0) {
        return res.status(400).json({ message: "Image upload failed" });
      }

      req.files.image.forEach((img) => {
        images.push(img.filename);
      });
    }

    const newTeam = await Team.create({
      name,
      position,
      description,
      image: images,
      status,
    });
    res
      .status(201)
      .json({ message: "Team member added successfully", data: newTeam });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding team", error: error.message });
  }
};

exports.getTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.status(200).json({ message: "Team fetched successfully", data: team });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching team", error: error.message });
  }
};

exports.getAllTeam = async (req, res) => {
  try {
    const apiFeatures = new ApiFeatures(Team.find(), req.query)
      .search(["name", "position"])
      .filter()
      .sort()
      .pagination();

    const teams = await apiFeatures.query;
    const teamCount = await Team.countDocuments();
    res.status(200).json({ message: "Team fetched successfully", data: teams, count: teamCount });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching team", error: error.message });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, description, status } = req.body || {};
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    let images = [...team.image];
    var toRemove = req.body?.removedImage;

    if (toRemove && !Array.isArray(toRemove)) {
      toRemove = ["None/none", toRemove];
    }

    if (toRemove && Array.isArray(toRemove)) {
      await Promise.all(
        toRemove.map(async (pid) => {
          cloudinary.uploader.destroy(pid);
        }),
      );
      images = images.filter((img) => !toRemove.includes(img));
    }

    if (req.files && req.files.image) {
      const updatedImages = req.files.image.map((file) => file.filename);
      images = [...images, ...updatedImages];
    }

    team.name = name ?? team.name;
    team.description = description ?? team.description;
    team.position = position ?? team.position;
    team.status = status ?? team.status;

    team.image = images;
    const updatedTeam = await team.save();

    res.status(200).json({
      message: "Team updated successfully",
      data: updatedTeam,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding team", error: error.message });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    // Remove associated images from the file system
    // team.image.forEach((img) => {
    //   const imagePath = `./uploads/${img}`;
    //   fs.remove(imagePath);
    // });

    if (team.image && team.image.length > 0) {
      for (const image of team.image) {
        const pid = image.split(".")[0];
        const res = await cloudinary.uploader.destroy(pid);
      }
    }

    await Team.findByIdAndDelete(id);
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding team", error: error.message });
  }
};
