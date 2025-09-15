import React from "react";
import cn from "clsx";
import PropTypes from "prop-types";
import HeaderHome from "../home/HeaderHome";
import { useNavigate } from "react-router-dom";

export default function Lesson() {
  const navigate = useNavigate();
  return (
    <>
      <div className="max-w-7xl mx-auto">
        <HeaderHome />
      </div>
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Advanced React Development
                </h1>
                <p className="text-xl text-muted-foreground">
                  Master React with hooks, context, and advanced patterns to
                  build scalable applications
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="bg-secondary px-4 py-2 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Duration
                  </span>
                  <p className="font-semibold text-foreground">8 weeks</p>
                </div>
                <div className="bg-secondary px-4 py-2 rounded-lg">
                  <span className="text-sm text-muted-foreground">Level</span>
                  <p className="font-semibold text-foreground">Advanced</p>
                </div>
                <div className="bg-secondary px-4 py-2 rounded-lg">
                  <span className="text-sm text-muted-foreground">
                    Students
                  </span>
                  <p className="font-semibold text-foreground">2,458</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  {"Go to Course"}
                </Button>
                <Button variant="outline" size="lg">
                  Share Course
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://placehold.co/600x400"
                alt="Advanced React Development course banner featuring modern web development interface with code editor and visual components"
                className="w-full h-auto rounded-xl shadow-lg"
              />
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                Best Seller
              </div>
            </div>
          </div>

          {/* Course Content */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {/* Overview Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Overview</CardTitle>
                  <CardDescription>
                    What you'll learn in this comprehensive course
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground mb-4">
                    This advanced React course will take your skills to the next
                    level. You'll learn advanced patterns, state management
                    techniques, performance optimization, and how to build
                    scalable React applications.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span className="text-foreground">
                        React Hooks Mastery
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span className="text-foreground">Context API</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span className="text-foreground">Performance Opt</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      <span className="text-foreground">
                        Testing Strategies
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Curriculum Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Curriculum</CardTitle>
                  <CardDescription>
                    Weekly modules and learning objectives
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        week: 1,
                        title: "Advanced Hooks Patterns",
                        lessons: 5,
                        duration: "4h 30m",
                      },
                      {
                        week: 2,
                        title: "State Management Deep Dive",
                        lessons: 6,
                        duration: "5h 15m",
                      },
                      {
                        week: 3,
                        title: "Performance Optimization",
                        lessons: 4,
                        duration: "3h 45m",
                      },
                      {
                        week: 4,
                        title: "Testing React Applications",
                        lessons: 5,
                        duration: "4h 20m",
                      },
                    ].map((module, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div>
                          <h4 className="font-semibold text-foreground">
                            Week {module.week}: {module.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {module.lessons} lessons • {module.duration}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/lesson/${module.week}`)}
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Instructor Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Instructor</CardTitle>
                  <CardDescription>Meet your course instructor</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-6">
                    <img
                      src="https://placehold.co/100x100"
                      alt="Portrait of Sarah Johnson, React expert and senior frontend developer with professional demeanor"
                      className="w-20 h-20 rounded-full"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        Sarah Johnson
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Senior Frontend Engineer • 8+ years experience
                      </p>
                      <p className="text-foreground">
                        Sarah is a React expert with extensive experience in
                        building large-scale applications. She has worked with
                        Fortune 500 companies and startups alike, specializing
                        in performance optimization and clean code architecture.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-foreground mb-2">
                      $199
                    </div>
                    <p className="text-muted-foreground mb-4">
                      One-time payment, lifetime access
                    </p>
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Enroll Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Features Card */}
              <Card>
                <CardHeader>
                  <CardTitle>What's Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-primary rounded-full mr-3 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                      </div>
                      <span className="text-foreground">32 hours of video</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-primary rounded-full mr-3 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                      </div>
                      <span className="text-foreground">
                        Downloadable resources
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-primary rounded-full mr-3 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                      </div>
                      <span className="text-foreground">
                        Certificate of completion
                      </span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-primary rounded-full mr-3 flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                      </div>
                      <span className="text-foreground">Community access</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card>
                <CardHeader>
                  <CardTitle>Stay Updated</CardTitle>
                  <CardDescription>
                    Get notified about new courses and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                      />
                    </div>
                    <Button variant="outline" className="w-full">
                      Subscribe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

//Button
export const Button = React.forwardRef(
  (
    { className, variant = "default", size = "md", disabled, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variantStyles = {
      default:
        "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary",
      outline:
        "border border-input hover:bg-accent hover:text-foreground focus:ring-foreground",
      ghost:
        "bg-transparent hover:bg-accent hover:text-foreground focus:ring-foreground",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-base",
      lg: "h-12 px-6 text-lg",
    };

    return (
      <button
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

Button.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "outline", "ghost"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  disabled: PropTypes.bool,
};

//Card

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

//Input
export const Input = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

Input.propTypes = {
  className: PropTypes.string,
};

//Label

export const Label = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "mb-2 block text-sm font-medium text-foreground",
        className
      )}
      {...props}
    />
  );
});
Label.displayName = "Label";

Label.propTypes = {
  className: PropTypes.string,
};
