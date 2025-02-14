import { School } from "../models/school.model.js";
import { User } from "../models/user.model.js";


// create new school
export const createSchool = async (req, res) => {
    try {
        const { name, address, principal,email} = req.body;

        // Check if the principal exists and is a teacher
        const principalUser = await User.findById(principal);
        if (!principalUser || principalUser.role !== "teacher") {
            return res.status(400).json({ message: "Invalid principal ID" });
        }

        const newSchool = new School({ name, address, principal ,email });
        await newSchool.save();

        res.status(201).json({ message: "School created successfully", school: newSchool });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// get all schools

export const getAllSchools = async (req, res) => {
    try {
        const schools = await School.find().populate("principal", "name email");
        res.status(200).json(schools);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// get a single school by id
export const getSchoolById = async (req, res) => {
    try {
        const school = await School.findById(req.params.id)
            .populate("principal", "name email")
            .populate("students", "name email")
            .populate("teachers", "name email");

        if (!school) {
            return res.status(404).json({ message: "School not found" });
        }

        res.status(200).json(school);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// update school details

export const updateSchool = async (req, res) => {
    try {
        const { name, address, principal } = req.body;

        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).json({ message: "School not found" });
        }

        if (name) school.name = name;
        if (address) school.address = address;
        if (principal) {
            const principalUser = await User.findById(principal);
            if (!principalUser || principalUser.role !== "teacher") {
                return res.status(400).json({ message: "Invalid principal ID" });
            }
            school.principal = principal;
        }

        await school.save();
        res.status(200).json({ message: "School updated successfully", school });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// delete a School

export const deleteSchool = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).json({ message: "School not found" });
        }

        await school.deleteOne();
        res.status(200).json({ message: "School deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};