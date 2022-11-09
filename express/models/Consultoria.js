const { Schema, model } = require("mongoose");

const ConsultoriaSchema = Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  consultor: {
    type: Schema.Types.ObjectId,
    ref: "Consultor",
    required: true,
  },
  cliente: {
    type: Schema.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  area: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pendiente",
    enum: ["Pendiente", "Aceptada", "Rechazada"],
  },
}, {
  timestamps: true,
});

ConsultoriaSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("Consultoria", ConsultoriaSchema);
