const Team = require("../model/team.model");
const fs = require("fs-extra");

exports.addTeam = async (req, res) => {
  try {
    const { name, position, description,status } = req.body;
    const image = req.files;
    console.log(image);
    

    if ((!name, !position, !description, !image)) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (image.length <= 0) {
      return res.status(400).json({ message: "Image upload failed" });
    }
    var images = [];

    req.files.image.forEach((img) => {
      images.push(img.filename);
    });

    const newTeam = await Team.create({
      name,
      position,
      description,
      image: images,
      status
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
    const team = await Team.find();
    res.status(200).json({ message: "Team fetched successfully", data: team });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding team", error: error.message });
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, position, description,status } = req.body || {};
    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    let images = [...team.image];
    let teamImages = team.image;
    if (req.body?.removedImage) {
      let removeImage = req.body.removedImage;

      removeImage.forEach((element) => {
        teamImages.forEach((items, index) => {
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
    team.image.forEach((img) => {
      const imagePath = `./uploads/${img}`;
      fs.remove(imagePath);
    });

    await Team.findByIdAndDelete(id);
    res.status(200).json({ message: "Team deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding team", error: error.message });
  }
};
