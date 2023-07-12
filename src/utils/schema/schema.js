import * as Yup from "yup";

export const passwordSchema = Yup.object().shape({
    new_password: Yup.string()
        .required("New password is required")
        .min(8, "Too Short!")
        // .matches(/^[A-Za-z0-9_]*$/, "Only Letters & Numbers Allowed"),
        .matches(
            /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
            "Only Letters & Numbers Allowed"
        ),
    
    confirm_password: Yup.string()
        .required("Confirm password is required")
        .min(8, "Too Short!")
        .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, "Only Letters & Numbers Allowed"),
});

export const verticalSchema = Yup.object().shape({
    name: Yup.string()
        .required("Name is required"),
    weight: Yup.string()
        .required("Weight is required"),
    keys: Yup.array().of(Yup.string().required("Keys is required"))

});
