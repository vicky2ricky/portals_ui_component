## FLOW

- Get all the rooms for a floor.
- Get the new selections - and set a Flag `newSelectionsExist`
- If `newSelectionsExist`, Set the `shapesFromResponse` & load the floorPlan
- If `!newSelectionsExist`, Get the legacy floor plan & use that to infer the existing shapes.
- If legacy floor plan, then load it & the existing shapes ( converted to the new format )
- and eventually with setUpFloorSvg - Draw the shapes.
- At this point, if an Update call is made - then the floorSvg also needs to be saved !!!

### Getting zone Colors
Once the shapes are drawn, `generateShapeColors` on HeatmapService is called, which internally calls `getZoneColor`.
This function then sets values on an Observable, which is subscribed by each floor. So Each floor would get the subscription for all the zones, across all the floors.

The floor should then check on the data, which would also contain a floorId, and react to the appropriate ones.

- For each shape, we would create a Pattern, and decide on the background color, ccuColor & stroke color.
- Add the zone name, and the temperatures in appropriate colors.


```mermaid
flowchart TB
    start([Floor Component])
    start --> load_floor_plan

    subgraph load_floor_plan [Load Floor Plan & Shapes]
        direction TB
        a(Get all the rooms for a floor)
        a --> b
        b{Get New Selections}
        b -->|YES| c[set a Flag `newSelectionsExist`]
        c --> d[set the `shapesFromResponse`]
        d --> e[Load FloorPlan & the Shapes]
        b -->|NO| g{Get Legacy floor plan}
        g -->|YES| h[Calculate Existing Shapes]
        h --> i[Load legacy floor plan]
        i --> j[Draw existing shapes, converted to the new format]
    end

    e --> k
    j --> k
    k[Update]