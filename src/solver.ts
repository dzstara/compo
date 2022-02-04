import * as kiwi from "@lume/kiwi";
import { Result, Parameters, PreferenceValue } from "./types";

export function solver(params: Parameters): Array<Result> {
  const variables: { [key: string]: kiwi.Variable } = {};

  const solver = new kiwi.Solver();

  params.activities.forEach((map) => {
    const activityVariables: kiwi.Variable[] = [];

    params.members.forEach((member) => {
      const preference = params.preferences.find(
        (c) =>
          c.activity === map.id &&
          c.member === member.id &&
          c.value !== PreferenceValue.Unknown &&
          c.value !== PreferenceValue.No
      );

      if (!preference) return;

      const strength =
        preference.value === PreferenceValue.Maybe
          ? kiwi.Strength.weak
          : kiwi.Strength.strong;

      const variable = new kiwi.Variable();

      solver.addEditVariable(variable, strength);
      solver.suggestValue(variable, 0);
      solver.suggestValue(variable, 1);

      solver.addConstraint(
        new kiwi.Constraint(
          new kiwi.Expression(variable),
          kiwi.Operator.Ge,
          new kiwi.Expression(0),
          kiwi.Strength.required
        )
      );

      solver.addConstraint(
        new kiwi.Constraint(
          new kiwi.Expression(variable),
          kiwi.Operator.Le,
          new kiwi.Expression(1),
          kiwi.Strength.required
        )
      );

      const id = "M" + map.id + "P:" + member.id;
      variables[id] = variable;
      activityVariables.push(variable);
    });

    solver.addConstraint(
      new kiwi.Constraint(
        new kiwi.Expression(map.info),
        kiwi.Operator.Eq,
        new kiwi.Expression(...activityVariables),
        kiwi.Strength.required
      )
    );
  });

  // No overlap between exclusivities

  params.exclusivities.forEach((exclusivity) => {
    const activityMembers = exclusivity
      .map(
        (mapIndex) =>
          params.preferences
            .filter((c) => c.activity === mapIndex)
            ?.map((c) => c.member) ?? []
      )
      .flat();

    const intersectingMembers = Object.entries(
      activityMembers.reduce(function (acc, curr) {
        if (acc[curr]) ++acc[curr];
        else acc[curr] = 1;
        return acc;
      }, {} as { [key: string]: number })
    )
      .filter(([_, count]) => count > 1)
      .map(([memberName]) => memberName);

    intersectingMembers.forEach((memberName) => {
      const memberVariableNames = exclusivity.map(
        (mapIndex) => "M" + mapIndex + "P:" + memberName
      );
      const memberVariables = Object.entries(variables)
        .filter(([variableName]) => memberVariableNames.includes(variableName))
        .map(([_, variable]) => variable);

      solver.addConstraint(
        new kiwi.Constraint(
          new kiwi.Expression(...memberVariables),
          kiwi.Operator.Le,
          new kiwi.Expression(1),
          kiwi.Strength.required
        )
      );
    });
  });

  // Fair share

  if (params.fair) {
    const optimum = Math.ceil(
      params.activities
        .filter(
          (activity) => !params.inclusivities.flat().includes(activity.id)
        )
        .map((m) => m.info)
        .reduce((a, c) => a + c, 0) / params.members.length
    );

    params.members.forEach((member) => {
      const memberVariables = Object.entries(variables)
        .filter(([variableName]) => variableName.includes(member.id))
        .map(([_, v]) => v);

      solver.addConstraint(
        new kiwi.Constraint(
          new kiwi.Expression(...memberVariables),
          kiwi.Operator.Le,
          new kiwi.Expression(optimum),
          kiwi.Strength.medium
        )
      );

      solver.addConstraint(
        new kiwi.Constraint(
          new kiwi.Expression(...memberVariables),
          kiwi.Operator.Ge,
          new kiwi.Expression(1),
          kiwi.Strength.strong
        )
      );
    });
  }

  solver.updateVariables();

  return params.activities.map((a) => ({
    ...a,
    participatingMembers: Object.entries(variables)
      .filter(
        ([variableName, variable]) =>
          variableName.startsWith("M" + a.id) && variable.value() === 1
      )
      .map(
        ([variableName]) =>
          params.members.find((m) => m.id === variableName.split("P:")[1])!
      ),
  }));
}
