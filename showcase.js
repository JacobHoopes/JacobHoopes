'use strict';
//
// Program 1: object showcase
//
// showcase.js
//
// CSCI 385: Computer Graphics, Reed College, Spring 2022
//
// This is a sample `opengl.js` program that displays a tetrahedron 
// made up of triangular facets, and also a cube and a cylinder.
//
// The OpenGL drawing part of the code occurs in drawScene and that
// function relies on drawObject to do its work. There is a global
// variable showWhich that can be changed by the user (by pressing
// number keys handled by handleKey). The drawObject code calls
// glBeginEnd to draw the chosen object.
//
// Your assignment is to add these models to the showcase code:
//
// - Sphere: A faceted model of the surface of a sphere.
// - Torus:A faceted model of the surface of a torus.
// - Revolution: Some other *surfaces of revolution*.
// - Programmer's choice: either of the following:
//    - Terrain: A faceted model of some gridded terrain.
//    - Pasta: A faceted mode of some shape of pasta.
//
// FOr each of these, you'll write functions that describe the
// object in 3-space, modify drawObject to draw them, and modify
// the keyboard handler code in handleKey to allow the user to
// select and configure them.
//
// This is all described in the web document
//
//   http://jimfix.github.io/csci385/assignments/showcase.md.html
//


//
let orientation = quatClass.for_rotation(1, new vector(0,0,0));
let mouseStart  = {x: 0.0, y: 0.0};
let mouseDrag   = false;
//
let showWhich = 5;
let smoothness = 32;
let layers = 10;
let gradient = false; // if this isn't true, then it will use the basic blue/white color scheme
//
let vw = window.innerWidth; 
let vh = window.innerHeight;
//

function makeCube() {
    /*
     * This describes the facets of a cube
     */
    
    glBegin(GL_TRIANGLES,"Cube",true);
    // front
    glColor3f(0.5,0.5,0.0);
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f( 0.5, 0.5, 0.5);
    
    glVertex3f( 0.5, 0.5, 0.5);
    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f(-0.5,-0.5, 0.5);
    
    // back
    glColor3f(0.5,0.5,1.0);
    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    
    glVertex3f( 0.5, 0.5,-0.5);
    glVertex3f(-0.5, 0.5,-0.5);
    glVertex3f(-0.5,-0.5,-0.5);

    // left
    glColor3f(1.0,0.5,0.5);
    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f(-0.5, 0.5,-0.5);
    glVertex3f(-0.5, 0.5, 0.5);
    
    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f(-0.5,-0.5,-0.5);
    
    // right
    glColor3f(0.0,0.5,0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    glVertex3f( 0.5, 0.5, 0.5);
    
    glVertex3f( 0.5, 0.5, 0.5);
    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    
    // top
    glColor3f(0.5,1.0,0.5);
    glVertex3f(-0.5, 0.5,-0.5);
    glVertex3f( 0.5, 0.5,-0.5);
    glVertex3f( 0.5, 0.5, 0.5);
    
    glVertex3f( 0.5, 0.5, 0.5);
    glVertex3f(-0.5, 0.5, 0.5);
    glVertex3f(-0.5, 0.5,-0.5);

    // bottom
    glColor3f(0.5,0.0,0.5);
    glVertex3f(-0.5,-0.5,-0.5);
    glVertex3f( 0.5,-0.5,-0.5);
    glVertex3f( 0.5,-0.5, 0.5);
    
    glVertex3f( 0.5,-0.5, 0.5);
    glVertex3f(-0.5,-0.5, 0.5);
    glVertex3f(-0.5,-0.5,-0.5);

    //
    glEnd();
}

function makeCylinder() {
    /* 
     * This describes the facets of a 24-sided cylindrical
     * object.
     */
    
    const width = 1.0;
    // const numFacets = 24;
    const dAngle = 2.0 * Math.PI / smoothness;

    glBegin(GL_TRIANGLES, "Cylinder", true);

    // Produce the top.
    for (let i = 0; i < smoothness; i += 1) {
        const aTop = dAngle * i;
        const xTop0 = Math.cos(aTop);
        const yTop0 = Math.sin(aTop);
        const xTop1 = Math.cos(aTop + dAngle);
        const yTop1 = Math.sin(aTop + dAngle);
	if (i % 2 == 0) {
	    glColor3f(0.25, 0.50, 0.75);
	} else {
	    glColor3f(0.50, 0.75, 0.80);
	}
	glVertex3f(  0.0,   0.0, width / 2.0);
        glVertex3f(xTop0, yTop0, width / 2.0);
        glVertex3f(xTop1, yTop1, width / 2.0);
    }
    
    // Produce the sides.
    for (let i = 0; i < smoothness; i += 1) {
        const aMid = dAngle * i;
        const xMid0 = Math.cos(aMid);
        const yMid0 = Math.sin(aMid);
        const xMid1 = Math.cos(aMid + dAngle);
        const yMid1 = Math.sin(aMid + dAngle);
	
	glColor3f(0.25, 0.50, 0.75);
        glVertex3f(xMid0, yMid0,  width / 2.0);
        glVertex3f(xMid0, yMid0, -width / 2.0);
        glVertex3f(xMid1, yMid1, -width / 2.0);

	glColor3f(0.50, 0.75, 0.80);
        glVertex3f(xMid0, yMid0,  width / 2.0);
        glVertex3f(xMid1, yMid1, -width / 2.0);
        glVertex3f(xMid1, yMid1,  width / 2.0);

    }
    
    // Produce the bottom.
    for (let i = 0; i < smoothness; i += 1) {
        const aBottom = dAngle * i;
        const xBottom0 = Math.cos(aBottom);
        const yBottom0 = Math.sin(aBottom);
        const xBottom1 = Math.cos(aBottom + dAngle);
        const yBottom1 = Math.sin(aBottom + dAngle);
	if (i % 2 == 0) {
	    glColor3f(0.25, 0.50, 0.75);
	} else {
	    glColor3f(0.50, 0.75, 0.80);
	}
	glVertex3f(     0.0,      0.0, -width / 2.0);
        glVertex3f(xBottom0, yBottom0, -width / 2.0);
        glVertex3f(xBottom1, yBottom1, -width / 2.0);
    }
    
    glEnd();
}

function makeTetra() {

    // This describes the facets of a tetrahedron whose
    // vertices sit at 4 of the 8 corners of the 
    // of the cube volume [-1,1] x [-1,1] x [-1,1].
    //
    // It's an example of GL_TRIANGLES.
    //
    
    // Draw all the triangular facets.
    glBegin(GL_TRIANGLES,"Tetra",true);

    // The three vertices are +-+ ++- -++ ---

    // all but ---
    glColor3f(1.0,1.0,0.0);
    glVertex3f( 1.0,-1.0, 1.0);
    glVertex3f( 1.0, 1.0,-1.0);
    glVertex3f(-1.0, 1.0, 1.0);
    // all but ++-
    glColor3f(0.0,1.0,1.0);
    glVertex3f( 1.0,-1.0, 1.0);
    glVertex3f(-1.0, 1.0, 1.0);
    glVertex3f(-1.0,-1.0,-1.0);
    // all but -++
    glColor3f(1.0,0.0,1.0);
    glVertex3f(-1.0,-1.0,-1.0);
    glVertex3f( 1.0, 1.0,-1.0);
    glVertex3f( 1.0,-1.0, 1.0);
    // all but +-+
    glColor3f(1.0,1.0,1.0);
    glVertex3f( 1.0, 1.0,-1.0);
    glVertex3f(-1.0,-1.0,-1.0);
    glVertex3f(-1.0, 1.0, 1.0);

    glEnd();
}

function rotate(points, x, y, z) { // currently unused
    let newpoints = [];
    for (let i = 0; i < points.length; i++) {
        // rotate x degrees around the x-coordinate
        newpoints[i].x = points[i].x;
        newpoints[i].y = points[i].y * Math.cos(x) + points[i].z * (-1 * Math.sin(x));
        newpoints[i].z = points[i].y * Math.sin(x) + points[i].z * (Math.cos(x));

        // rotate y degrees around the y-coordinate
        newpoints[i].x = points[i].x * Math.cos(y) + points[i].z * Math.sin(y);
        newpoints[i].y = points[i].y;
        newpoints[i].z = points[i].x * (-1 * Math.sin(y)) + points[i].z * (Math.cos(y));

        // rotate z degrees around the z-coordinate
        newpoints[i].x = points[i].x * Math.cos(z) + points[i].y * (-1 * Math.sin(z));
        newpoints[i].y = points[i].x * Math.sin(z) + points[i].y * Math.cos(z);
        newpoints[i].z = points[i].z;
    }
    return newpoints;
}

function makeRevolution(name, points, geodesic = [], polarS = false) {
    glBegin(GL_TRIANGLES, name, true);
    
    const length = points.length;
    let c = 0;
    const swirls = true; // this makes cool swirls appear in the gradient coloring
    const polarSmoothing = polarS; // makes the poles of spheres the same color & the blending of the torus consistent
    for (let i=1; i<length-1; i++) {
        if (!gradient) {
            if (c == 0) {
                glColor3f(1,1,1);
                c = 1;
            } else {
                glColor3f(0.25, 0.50, 0.75);
                c = 0;
            }
        }
        for (let j=0; j<smoothness; j++) {
            if (gradient) {
                let I = i + 1;
                if (swirls) {
                    I = i;
                }
                P = 1 - (1/length*(I));
                if (polarSmoothing) {
                    P = Math.max((1 - 2*(1/length*I)),(2*(1/length*I)));
                }
                glColor3f(1,P,Math.max((1 - 2*(1/smoothness*j)),(2*(1/smoothness*j))));
            }
            glVertex3f(Math.cos(2 * Math.PI / smoothness * j) * points[i].x,points[i].y, Math.sin(2 * Math.PI / smoothness * j) * points[i].x);
            glVertex3f(Math.cos(2 * Math.PI / smoothness * ((j+1)%smoothness)) * points[i].x,points[i].y, Math.sin(2 * Math.PI / smoothness * ((j+1)%smoothness)) * points[i].x);
            glVertex3f(Math.cos(2 * Math.PI / smoothness * j) * points[i+1].x,points[i+1].y, Math.sin(2 * Math.PI / smoothness * j) * points[i+1].x);
            if (!gradient) {
                if (c == 0) {
                    glColor3f(1,1,1);
                    c = 1;
                } else {
                    glColor3f(0.25, 0.50, 0.75);
                    c = 0;
                }
            } else {
                glColor3f(1,P,Math.max((1 - 2*(1/smoothness*j)),(2*(1/smoothness*j))));
            }
            glVertex3f(Math.cos(2 * Math.PI / smoothness * j) * points[i].x,points[i].y, Math.sin(2 * Math.PI / smoothness * j) * points[i].x);
            glVertex3f(Math.cos(2 * Math.PI / smoothness * ((j+1)%smoothness)) * points[i].x,points[i].y, Math.sin(2 * Math.PI / smoothness * ((j+1)%smoothness)) * points[i].x);
            glVertex3f(Math.cos(2 * Math.PI / smoothness * ((j+1)%smoothness)) * points[i-1].x,points[i-1].y, Math.sin(2 * Math.PI / smoothness * ((j+1)%smoothness)) * points[i-1].x);
        }
    }
    glColor3f(1,0,0);
    for (let i=0; i<geodesic.length; i++) {
        glVertex3f(geodesic[i].x, geodesic[i].y, geodesic[i].z);
    }
    glEnd();
}

function makeSphere() {
    let points = [];
    for (let i = 0; i <= layers; i++) {
        points.push({x: Math.sin(Math.PI / layers * i), y: -1 * Math.cos(-1 * Math.PI / layers * i)})
    }
    makeRevolution('Sphere', points);
}

function addGeodesic(radius, distance=0, x1=radius+distance, y1=0, z1=0, theta,) { 
    glColor3f(1,0,0);
    const lineWidth = 0.02;
    const offset = 0.00;
    let geodesic = [];
    let i = 0;
    while ((geodesic.length <= 12) || !((geodesic[geodesic.length-1].z < 0) && (geodesic[geodesic.length - 7].z > 0))) { // starts at (distance+radius,0,0) // this is all to make sure the geodesic only does one cycle around the object

        geodesic.push({x: Math.sin(Math.PI/2+2*Math.PI/(smoothness)*i)*(distance + radius + offset), y: 0-lineWidth + Math.sin(0), z: Math.cos(Math.PI/2+2*Math.PI/(smoothness)*i)*(distance + radius + offset)});
        geodesic.push({x: Math.sin(Math.PI/2+2*Math.PI/(smoothness)*i)*(distance + radius + offset), y: 0+lineWidth, z: Math.cos(Math.PI/2+2*Math.PI/(smoothness)*i)*(distance + radius + offset)});
        geodesic.push({x: Math.sin(Math.PI/2+2*Math.PI/(smoothness)*((i+1)%(smoothness)))*(distance + radius + offset), y: 0+lineWidth, z: Math.cos(Math.PI/2+2*Math.PI/(smoothness)*((i+1)%(smoothness)))*(distance + radius + offset)});

        geodesic.push({x: Math.sin(Math.PI/2+2*Math.PI/(smoothness)*i)*(distance + radius + offset), y: 0-lineWidth, z: Math.cos(Math.PI/2+2*Math.PI/(smoothness)*i)*(distance + radius + offset)});
        geodesic.push({x: Math.sin(Math.PI/2+2*Math.PI/(smoothness)*((i+1)%(smoothness)))*(distance + radius + offset), y: 0-lineWidth, z: Math.cos(Math.PI/2+2*Math.PI/(smoothness)*((i+1)%(smoothness)))*(distance + radius + offset)});
        geodesic.push({x: Math.sin(Math.PI/2+2*Math.PI/(smoothness)*((i+1)%(smoothness)))*(distance + radius + offset), y: 0+lineWidth, z: Math.cos(Math.PI/2+2*Math.PI/(smoothness)*((i+1)%(smoothness)))*(distance + radius + offset)});
        i++;
    }
    return geodesic;
    
}

function makeTorus() {
    const size = 0.8; // does weird things if less than width (disco ball effect if equal to 0)
    const width = 0.5;
    // aligns color interestingly if layers is odd and gradient = false
    let points = [];
    for (let i = 0; i <= layers + 1; i++) {
        points.push({x: size + width * Math.sin(2 * Math.PI / layers * i), y: width * Math.cos(-2 * Math.PI / layers * i)})
    }
    const geodesic = addGeodesic(width, size);
    makeRevolution('Torus',points, geodesic, true);
}

function makeThing() {
    let points = [];
    for (let i = 0; i <= layers; i++) {
        points.push({x: 1.3 - Math.sin(Math.PI / layers * i), y: -1 * Math.cos(-1 * Math.PI / layers * i)})
    }

    makeRevolution('Thing',points);
}

function makeThing2() {
    let points = [];
    const midWidth = 0.8; // t
    const squish = 6.8; // r
    const totalH = 2; // a
    for (let i = 0; i <= layers; i++) {
        let h = totalH / layers * i - totalH / 2;
        let w = midWidth*(Math.sin(squish*(h**2))-Math.sin(squish*(totalH /-2)**2));
        points.push({x: w, y: h});
    } // desmos really made this one possible, wow

    makeRevolution('Thing2',points);
}

function makeCool() { // This is the cool christmas tree sphere
    glBegin(GL_TRIANGLES, 'Cool', true);
    let points = [];
    for (let i=0; i<=layers + 2; i++) {
        points.push({x: Math.sin(Math.PI/(layers+2)*i), y: -1 * Math.cos(Math.PI/(layers+2)*i)});
    }
    for (let i=0; i<=layers+2; i++) {
        for (let j=0; j<smoothness; j++) {
            glColor3f((Math.min(1/smoothness*j,1-1/smoothness*j)),0,(Math.min(1/smoothness*j,1-1/smoothness*j)));
            glVertex3f(Math.cos(2*Math.PI / smoothness * j) * points[i].x,points[i].y,Math.sin(2*Math.PI / smoothness * j) * points[i].x);
            glVertex3f(Math.cos(2*Math.PI / smoothness * (j+1)) * points[i].x,points[i].y,Math.sin(2*Math.PI / smoothness * (j+1)) * points[i].x);
            glVertex3f(0,0,0);
            
        }
    }
    glEnd();
}

function drawSweep(funct, shapeOutline) {


    for (let i=0; i<smoothness; i++) { // find a center (g(x)), where x goes from 0 to 1 (x =i/smoothness)
        let normal = 5;
        let tangent = gPrime(i / smoothness);
    }
}


function revolve (points, equation, axis) {


    for (let i=0; i<points.length; i++) {
        if (axis == 'x') {
            points[i].x = equation()
        }
        if (axis == 'y') {
            points[i].y = equation()
        }
        if (axis == 'z') {
            points[i].z = equation()
        }
        
    }
}

function makeRevolvedBody(name, points, nRotations) {
    glBegin(GL_TRIANGLES, name, true)
    function xRotEq(x) { // equation that defines the rotation of the object in the x-dimension
        points
    }
    function yRotEq(points, y) { // equation that defines the rotation of the object in the y-dimension
        points
    }
    function zRotEq(z) { // equation that defines the rotation of the object in the z-dimension
        //
    }
    for (let i=1; i<length-1; i++) {
        for (let j=0; j<smoothness; j++) {
            xRotEq(1424);

            glVertex3f(Math.cos(2 * Math.PI / smoothness * j) * points[i].x,points[i].y, Math.sin(2 * Math.PI / smoothness * j) * points[i].x);
            glVertex3f(Math.cos(2 * Math.PI / smoothness * ((j+1)%smoothness)) * points[i].x,points[i].y, Math.sin(2 * Math.PI / smoothness * ((j+1)%smoothness)) * points[i].x);
            glVertex3f(Math.cos(2 * Math.PI / smoothness * j) * points[i+1].x,points[i+1].y, Math.sin(2 * Math.PI / smoothness * j) * points[i+1].x);
            
            glVertex3f(Math.cos(2 * Math.PI / smoothness * j) * points[i].x,points[i].y, Math.sin(2 * Math.PI / smoothness * j) * points[i].x);
            glVertex3f(Math.cos(2 * Math.PI / smoothness * ((j+1)%smoothness)) * points[i].x,points[i].y, Math.sin(2 * Math.PI / smoothness * ((j+1)%smoothness)) * points[i].x);
            glVertex3f(Math.cos(2 * Math.PI / smoothness * ((j+1)%smoothness)) * points[i-1].x,points[i-1].y, Math.sin(2 * Math.PI / smoothness * ((j+1)%smoothness)) * points[i-1].x);
        }
    }
    glEnd();
}

function makeMobius() {
    const size = 1;
    const width = 0.5; // 2
    const height = 0.2; // 1
    const minRects = 18; // trying to make sure that there's no curves along the corners - I want angularity/the rectangles to line up
    const xSquares = minRects / 2 * (width / (width+height)) / 2;
    const ySquares = minRects / 2 - xSquares;
    var points = [];
    for (let i=0; i<=layers/(2*(width+height))*width/2; i++) { // from the bottom middle to the bottom right
        points.push({x: size + width * Math.sin(2 * Math.PI / layers * i), y: width * Math.cos(-2 * Math.PI / layers * i)})
    }
    for (let i=0; i<=layers+1; i++) { // from the bottom right to the top right
        points.push({x: size + width * Math.sin(2 * Math.PI / layers * i), y: width * Math.cos(-2 * Math.PI / layers * i)})
    }
    for (let i=0; i<=layers+1; i++) { // from the top right to the top middle
        points.push({x: size + width * Math.sin(2 * Math.PI / layers * i), y: width * Math.cos(-2 * Math.PI / layers * i)})
    }
    makeRevolvedBody('Mobius', points, 0.5);
}

// string literals in the form: point = {x:1.0,y:-1.0}
// points = [point1, point2, point3]

function buildObjects() {
    makeTetra();
    makeCube();
    makeCylinder();
    makeSphere();
    makeTorus();
    makeThing();
    makeThing2();
    makeCool();
}

function drawObject() {

    /*
     * Draw the object selected by the user.
     */
    
    if (showWhich == 1) {
	glBeginEnd("Tetra");
    }
    if (showWhich == 2) {
	glBeginEnd("Cube");
    }
    if (showWhich == 3) {
	glBeginEnd("Cylinder");
    }
    //
    // Add other objects for the assignment here.
    //
    if (showWhich == 4) {
    glBeginEnd('Sphere');
    }
    if (showWhich == 5) {
    glBeginEnd('Torus');
    }
    if (showWhich == 6) {
    glBeginEnd('Thing');
    }
    if (showWhich == 7) {
    glBeginEnd('Thing2');
    }
    if (showWhich == 8) {
    glBeginEnd('Cool');
    }
}

function drawScene() {
    /*
     * Issue GL calls to draw the scene.
     */

    // Clear the rendering information.
    glClearColor(0.2,0.2,0.3);
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
    glEnable(GL_DEPTH_TEST);

    // Clear the transformation stack.
    glMatrixMode(GL_MODELVIEW);
    glLoadIdentity();

    // Transform the object by a rotation.
    orientation.glRotatef();

    // Draw the object.
    glPushMatrix();
    glScalef(0.5,0.5,0.5);
    drawObject();
    glPopMatrix();
    
    // Render the scene.
    glFlush();

}

function handleKey(key, x, y) {
    /*
     * Handle a keypress.
     */

    //
    // Handle object selection.
    //

    if (key >= 1 && key <= 8) {
        showWhich = parseInt(key);
    }
    if (key == ',' && smoothness > 4) {
        smoothness /= 2;
    }
    if (key == '.' && smoothness <= 256) {
        smoothness *= 2;
    }
    if (key == '-' && layers > 2) {
        layers -= 1;
    }
    if (key == '=' && layers < 30) {
        layers += 1;
    }
    if (key == '|') {
        gradient = !gradient; // could potentially make a third form a gradient with truly smooth coloring
    }

    buildObjects();
    glutPostRedisplay();
}

function worldCoords(mousex, mousey) {
    /*
     * Compute the world/scene coordinates associated with
     * where the mouse was clicked.
     */

    const pj = mat4.create();
    glGetFloatv(GL_PROJECTION_MATRIX,pj);
    const pj_inv = mat4.create();
    mat4.invert(pj_inv,pj);
    const vp = [0,0,0,0];
    glGetIntegerv(GL_VIEWPORT,vp);
    const mousecoords = vec4.fromValues(2.0*mousex/vp[2]-1.0,
					1.0-2.0*mousey/vp[3],
					0.0, 1.0);
    vec4.transformMat4(location,mousecoords,pj_inv);
    return {x:location[0], y:location[1]};
}    

var mouseButton = 0;

function handleMouseClick(button, state, x, y) {
    /*
     * Records the location of a mouse click in 
     * world/scene coordinates.
     */
    
    // Start tracking the mouse for trackball motion.
    mouseStart  = worldCoords(x,y);
    mouseButton = button;
    if (state == GLUT_DOWN) {
	mouseDrag = true;
    } else {
	mouseDrag = false;
    }
    glutPostRedisplay()
}

var mouseNow = 0;
var dx = 0;
var dy = 0;
var axis = 0;
var angle = 0;

function handleMouseMotion(x, y) {
    /*
     * Reorients the object based on the movement of a mouse drag.
     *
     * Uses last and current location of mouse to compute a trackball
     * rotation. This gets stored in the quaternion orientation.
     *
     */
    
    // Capture mouse's position.
    mouseNow = worldCoords(x,y)

    // Update object/light orientation based on movement.
    dx = mouseNow.x - mouseStart.x;
    dy = mouseNow.y - mouseStart.y;
    axis = (new vector(-dy,dx,0.0)).unit()
    angle = Math.asin(Math.min(Math.sqrt(dx*dx+dy*dy),1.0))
    orientation = quatClass.for_rotation(angle,axis).times(orientation);

    // Ready state for next mouse move.
    mouseStart = mouseNow;

    // Update window.
    glutPostRedisplay()
}

function resizeWindow(w, h) {
    /*
     * Register a window resize by changing the viewport. 
     */
    glViewport(0, 0, w, h);
    glMatrixMode(GL_PROJECTION);
    glLoadIdentity();
    if (w > h) {
        glOrtho(-w/h, w/h, -1.0, 1.0, -1.0, 1.0);
    } else {
        glOrtho(-1.0, 1.0, -h/w * 1.0, h/w * 1.0, -1.0, 1.0);
    }
    glutPostRedisplay();
}

function main() {
    /*
     * The main procedure, sets up GL and GLUT.
     */

    // set up GL/UT, its canvas, and other components.
    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH);
    glutInitWindowPosition(0, 20);
    glutInitWindowSize(vw, vh);
    glutCreateWindow('object showcase' )
    resizeWindow(vw, vh); // It seems to need this.                                                                                                         

    // Build the renderable objects.
    buildObjects();

    // Register interaction callbacks.
    glutKeyboardFunc(handleKey);
    glutReshapeFunc(resizeWindow);
    glutDisplayFunc(drawScene);
    glutMouseFunc(handleMouseClick)
    glutMotionFunc(handleMouseMotion)

    // Go!

    glutMainLoop();
    _GLresizeCanvas();

    return 0;
}

glRun(main,true);
